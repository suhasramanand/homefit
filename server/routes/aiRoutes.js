
const express = require('express');
const { auth } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const router = express.Router();
require('dotenv').config();

// Groq API key from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Rate limiting configuration
const aiRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // Default: 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10, // Default: 10 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: function (req) {
    return req.session?.user?.id || req.ip; // Use user ID if available, otherwise IP
  },
  handler: function (req, res) {
    // Return remaining time until rate limit reset
    const resetTime = new Date(Date.now() + req.rateLimit.resetTime).getTime();
    res.status(429).json({
      message: 'Too many requests, please try again later.',
      rateLimitReset: resetTime
    });
  }
});

// Get an explanation for an apartment match
router.post('/explain', auth, aiRateLimiter, async (req, res) => {
  try {
    const { prompt, cacheKey } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }
    
    // If Redis is available, check cache first
    if (req.redisClient) {
      try {
        const cachedExplanation = await req.redisClient.get(`explanation:${cacheKey}`);
        
        if (cachedExplanation) {
          console.log('Explanation retrieved from cache');
          
          // Set rate limit headers even on cache hits
          res.setHeader('X-RateLimit-Remaining', req.rateLimit.remaining);
          res.setHeader('X-RateLimit-Reset', req.rateLimit.resetTime);
          
          return res.json({ explanation: cachedExplanation, fromCache: true });
        }
      } catch (redisError) {
        console.error('Redis error when checking cache:', redisError);
        // Continue without cache if Redis error occurs
      }
    }
    
    // Check if Groq API key is available
    if (!GROQ_API_KEY) {
      return res.status(503).json({ 
        message: 'AI explanation service not configured',
        serviceUnavailable: true
      });
    }
    
    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert real estate advisor. Provide helpful, accurate, and concise information about apartment matches.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.5,
        max_tokens: 250
      })
    });
    
    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }
    
    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || '';
    
    // If Redis is available, cache the explanation
    if (req.redisClient && cacheKey && explanation) {
      try {
        // Cache explanations for 24 hours
        await req.redisClient.set(`explanation:${cacheKey}`, explanation, 'EX', 24 * 60 * 60);
        console.log('Explanation saved to cache');
      } catch (redisError) {
        console.error('Redis error when caching explanation:', redisError);
        // Continue without caching if Redis error occurs
      }
    }
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', req.rateLimit.remaining);
    res.setHeader('X-RateLimit-Reset', req.rateLimit.resetTime);
    
    res.json({ explanation, fromCache: false });
  } catch (error) {
    console.error('Error in AI explanation service:', error);
    res.status(500).json({ 
      message: 'Error generating explanation', 
      error: error.message 
    });
  }
});

module.exports = router;
