const axios = require("axios");
require("dotenv").config();
const logger = require('../utils/logger');
const { getAsync, setexAsync } = require('../utils/redisClient');

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Rate limiting state
let rateLimitResetTime = 0;
let rateLimitRemaining = Infinity;
let isRateLimited = false;

// Request queue for managing concurrent requests
const requestQueue = [];
let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 5; // Limit concurrent Groq API calls
const REQUEST_DELAY = 100; // Delay between requests in ms

/**
 * Wait for available slot in request queue
 */
async function waitForSlot() {
  return new Promise((resolve) => {
    if (activeRequests < MAX_CONCURRENT_REQUESTS && !isRateLimited) {
      resolve();
      return;
    }
    
    requestQueue.push(resolve);
    
    // Check if rate limit has expired
    if (isRateLimited && Date.now() >= rateLimitResetTime) {
      isRateLimited = false;
      rateLimitRemaining = Infinity;
    }
  });
}

/**
 * Release slot after request completes
 */
function releaseSlot() {
  activeRequests = Math.max(0, activeRequests - 1);
  
  if (requestQueue.length > 0 && activeRequests < MAX_CONCURRENT_REQUESTS && !isRateLimited) {
    const nextResolver = requestQueue.shift();
    activeRequests++;
    nextResolver();
  }
}

/**
 * Handle rate limit response
 */
function handleRateLimit(headers) {
  if (headers['retry-after']) {
    const retryAfter = parseInt(headers['retry-after'], 10);
    rateLimitResetTime = Date.now() + (retryAfter * 1000);
    isRateLimited = true;
    logger.warn(`Groq rate limit hit. Retry after ${retryAfter} seconds`);
  } else if (headers['x-ratelimit-reset']) {
    rateLimitResetTime = parseInt(headers['x-ratelimit-reset'], 10) * 1000;
    isRateLimited = Date.now() < rateLimitResetTime;
    logger.warn(`Groq rate limit hit. Reset at ${new Date(rateLimitResetTime).toISOString()}`);
  }
  
  if (headers['x-ratelimit-remaining']) {
    rateLimitRemaining = parseInt(headers['x-ratelimit-remaining'], 10);
    if (rateLimitRemaining <= 0) {
      isRateLimited = true;
    }
  }
}

/**
 * Generate cache key for Groq explanation
 */
function getCacheKey(preference, apartment) {
  // Create a stable key from preference and apartment IDs
  const prefId = preference?._id || JSON.stringify(preference);
  const aptId = apartment?._id || JSON.stringify(apartment);
  return `groq:explanation:${prefId}:${aptId}`;
}

/**
 * Get match explanation from Groq API with caching and rate limit handling
 */
exports.getMatchExplanation = async (preference, apartment, useCache = true) => {
  // Validate inputs
  if (!preference || !apartment) {
    logger.warn('getMatchExplanation called without preference or apartment');
    return null;
  }

  if (!process.env.GROQ_API) {
    logger.debug('GROQ_API not configured, skipping Groq explanation');
    return null;
  }

  // Check cache first
  if (useCache) {
    try {
      const cacheKey = getCacheKey(preference, apartment);
      const cached = await getAsync(cacheKey);
      if (cached) {
        logger.debug('Groq explanation cache hit');
        return cached;
      }
    } catch (cacheError) {
      logger.debug('Cache check failed (non-critical):', cacheError.message);
    }
  }

  // Check if we're rate limited
  if (isRateLimited) {
    if (Date.now() < rateLimitResetTime) {
      const waitTime = Math.ceil((rateLimitResetTime - Date.now()) / 1000);
      logger.debug(`Groq rate limited, skipping. Reset in ${waitTime}s`);
      return null;
    } else {
      // Rate limit expired
      isRateLimited = false;
      rateLimitRemaining = Infinity;
    }
  }

  // Wait for available slot in queue
  await waitForSlot();

  try {
    // Add small delay between requests to avoid hitting rate limits
    if (activeRequests > 0) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
    }

    const prompt = `
    You are an AI assistant helping users compare apartment listings with their preferences.

    Your task:
    1. Identify the features that match exactly between the user preference and apartment listing.
    2. Identify the features that differ or are missing.
    3. Identify bonus features that exceed user preferences (e.g., more amenities, better view, higher floor, larger sqft, etc.).
    4. Return a short explanation with:
      ✅ Matched = Exactly as user requested  
      ❌ Mismatched = Clearly missing or different  
      💎 Bonus = Better than requested (extra features, upgrades, etc.)
      🟡 Partial Match = Some overlap, unclear or softer difference + A field should never appear in both ❌ and 🟡
      
    Always check the following fields specifically:
    - Type
    - Bedrooms
    - Price (can be single value or range, match if within range)
    - Neighborhood
    - Amenities
    - Style
    - Floor
    - Move-in Date
    - Parking
    - Public Transport
    - Safety
    - Pets
    - View
    - Lease Capacity
    - Roommates

    📝 Format your output like this (strictly!):
    ✅ Matches in: A, B, C  
    ❌ Missing: D, E  
    💎 Bonus features: X, Y
    🟡 Partial Match: P, Q

    Keep it short and clean — no paragraphs, no preamble, no metadata, no extra notes.

    
    User Preferences:
    ${JSON.stringify(preference, null, 2)}
    
    Apartment Listing:
    ${JSON.stringify(apartment, null, 2)}
    `;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for real estate matching. Always respond with the exact format requested - no additional text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3, // Lower temperature for more consistent formatting
        max_tokens: 200, // Limit response length for faster processing
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API}`,
        },
        timeout: 5000, // 5 second timeout for Groq API
      }
    );

    // Handle rate limit headers
    if (response.headers) {
      handleRateLimit(response.headers);
    }

    if (!response.data?.choices?.[0]?.message?.content) {
      logger.warn('Groq API returned invalid response format');
      return null;
    }

    const explanation = response.data.choices[0].message.content.trim();
    
    // Cache the explanation for 24 hours
    if (useCache && explanation) {
      try {
        const cacheKey = getCacheKey(preference, apartment);
        await setexAsync(cacheKey, 24 * 60 * 60, explanation); // 24 hours cache
      } catch (cacheError) {
        logger.debug('Cache set failed (non-critical):', cacheError.message);
      }
    }
    
    return explanation;
  } catch (error) {
    releaseSlot();
    
    // Handle rate limit errors specifically (429)
    if (error.response?.status === 429) {
      handleRateLimit(error.response.headers);
      logger.warn('Groq API rate limit exceeded (429)');
      return null;
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      logger.debug('Groq API timeout');
      return null;
    }
    
    // Handle other errors
    if (error.response) {
      logger.debug("Groq API error:", {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      logger.debug("Groq API error:", error.message);
    }
    
    return null;
  } finally {
    releaseSlot();
  }
};

/**
 * Check if Groq API is available (not rate limited)
 */
exports.isGroqAvailable = () => {
  if (!process.env.GROQ_API) return false;
  if (isRateLimited && Date.now() < rateLimitResetTime) return false;
  return true;
};

/**
 * Get rate limit status
 */
exports.getRateLimitStatus = () => {
  return {
    isRateLimited,
    resetTime: rateLimitResetTime,
    remaining: rateLimitRemaining,
    activeRequests,
    queueLength: requestQueue.length
  };
};
