/**
 * User preferences and matching-related controller functions
 */

const Preference = require("../../models/Preference");
const Apartment = require("../../models/Apartment");
const User = require("../../models/User");
const { getMatchExplanation } = require("../../services/groqService");
const { calculateMatchScore } = require("../../utils/matchScoring");
const { getAsync, setexAsync, delAsync, redisClient } = require('../../utils/redisClient');
const logger = require("../../utils/logger");
const constants = require("../../utils/constants");
const { generateFallbackExplanation, clearMatchesCache } = require("./matchUtils");
const { buildApartmentQuery } = require("../../utils/queryBuilder");

/**
 * Submit or update preferences
 */
exports.submitPreferences = async (req, res) => {
  try {
    // 🔒 Get email from session
    const userEmail = req.session.user?.email;
    if (!userEmail) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Validate user exists
    const user = await User.findOne({ email: userEmail });
    if (!user || user.type !== constants.USER_TYPES.USER) {
      return res.status(403).json({ error: "Only regular users can submit preferences" });
    }

    // Validate required fields
    if (!req.body.priceRange && !req.body.bedrooms) {
      return res.status(400).json({ error: "At least price range or bedrooms must be specified" });
    }

    // 🔍 Check if user already submitted preferences
    const existing = await Preference.findOne({ userEmail });

    let preference;
    if (existing) {
      // 🔄 Update existing preference
      Object.assign(existing, req.body, { submittedAt: new Date() });
      preference = await existing.save();
      
      // Clear cache when preferences are updated
      await clearMatchesCache(existing._id.toString());
      
      // Return preference with flag indicating cache was cleared
      res.status(200).json({ 
        message: "Preferences updated successfully", 
        preference,
        cacheCleared: true 
      });
    } else {
      // 🆕 Create new preference
      preference = new Preference({
        ...req.body,
        userEmail,
        submittedAt: new Date(),
      });
      await preference.save();
      res.status(201).json({ message: "Preferences submitted successfully", preference });
    }
    
    logger.info('Preferences saved:', { email: userEmail });
  } catch (err) {
    logger.error("Submit/Update Preferences Error:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    
    res.status(400).json({ error: err.message || "Failed to save preferences" });
  }
};

/**
 * Get latest preference
 */
exports.getLatestPreference = async (req, res) => {
  try {
    const email = req.session?.user?.email;
    if (!email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const preference = await Preference.findOne({ userEmail: email })
      .sort({ submittedAt: -1 })
      .lean();

    if (!preference) {
      return res.status(404).json({ error: "No preferences found" });
    }

    res.status(200).json({ preference });
  } catch (err) {
    logger.error("Get latest preference error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get matches with filtering capabilities
 */
exports.getMatches = async (req, res) => {
  try {
    const { prefId } = req.params;
    
    // Validate preference ID
    if (!prefId || prefId.length !== 24) {
      return res.status(400).json({ message: "Invalid preference ID format" });
    }
    
    // Validate and sanitize pagination parameters
    const page = Math.max(constants.PAGINATION.DEFAULT_PAGE, parseInt(req.query.page) || constants.PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(constants.PAGINATION.MAX_LIMIT, Math.max(constants.PAGINATION.MIN_LIMIT, parseInt(req.query.limit) || constants.PAGINATION.DEFAULT_LIMIT));
    const sortBy = req.query.sortBy || constants.SORT_OPTIONS.MATCH_SCORE;
    const sortOrder = (req.query.sortOrder || constants.SORT_ORDER.DESC).toLowerCase();
    const forceRefresh = req.query.forceRefresh === 'true';
    
    // Validate sortBy and sortOrder
    const validSortBy = Object.values(constants.SORT_OPTIONS);
    if (!validSortBy.includes(sortBy)) {
      return res.status(400).json({ message: `Invalid sortBy. Must be one of: ${validSortBy.join(', ')}` });
    }
    
    if (sortOrder !== constants.SORT_ORDER.ASC && sortOrder !== constants.SORT_ORDER.DESC) {
      return res.status(400).json({ message: `sortOrder must be '${constants.SORT_ORDER.ASC}' or '${constants.SORT_ORDER.DESC}'` });
    }
    
    // Extract filter parameters
    const filters = {
      minPrice: req.query.minPrice ? parseInt(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice) : null,
      bedrooms: req.query.bedrooms ? req.query.bedrooms.split(',') : null,
      bathrooms: req.query.bathrooms ? req.query.bathrooms.split(',') : null,
      neighborhoods: req.query.neighborhoods ? req.query.neighborhoods.split(',') : null,
      amenities: req.query.amenities ? req.query.amenities.split(',') : null,
    };
    
    // Create a cache key based on all parameters
    const filterKey = Object.entries(filters)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => `${key}=${Array.isArray(value) ? value.join('-') : value}`)
      .join(':');

    const cacheKey = `matches:${prefId}:page${page}:limit${limit}:sort${sortBy}${sortOrder}:${filterKey}`;

    let cachedData = null;
    if (!forceRefresh) {
      cachedData = await getAsync(cacheKey);
    }

    if (cachedData) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    }
    
    logger.debug(`Cache miss for ${cacheKey}${forceRefresh ? ' (forced refresh)' : ''}, fetching from database...`);

    // Fetch and validate preference
    const pref = await Preference.findById(prefId);
    if (!pref) {
      logger.warn(`Preference not found: ${prefId}`);
      return res.status(404).json({ message: "Preferences not found" });
    }
    
    // Validate preference object
    if (typeof pref !== 'object' || pref === null) {
      logger.error(`Invalid preference object: ${prefId}`);
      return res.status(500).json({ message: "Invalid preference data" });
    }

    // Build query from filters with error handling
    let query = {};
    try {
      query = buildApartmentQuery(filters);
      logger.debug("Generated query:", JSON.stringify(query, null, 2));
    } catch (queryError) {
      logger.error('Error building apartment query:', queryError);
      // Use empty query as fallback
      query = {};
    }
    
    // Add geospatial location filter if preference has location
    if (pref.locationPreference && 
        pref.locationPreference.center && 
        Array.isArray(pref.locationPreference.center) &&
        pref.locationPreference.center.length >= 2) {
      const radius = pref.locationPreference.radius || 10; // Default 10km
      const center = pref.locationPreference.center; // [lng, lat]
      
      // Validate coordinates
      const lng = parseFloat(center[0]);
      const lat = parseFloat(center[1]);
      
      if (!isNaN(lng) && !isNaN(lat) && 
          lng >= -180 && lng <= 180 && 
          lat >= -90 && lat <= 90) {
        // Add geospatial query (MongoDB $nearSphere with maxDistance in meters)
        query['location.coordinates'] = {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        };
        logger.debug(`Added location filter: center=[${lng}, ${lat}], radius=${radius}km`);
      }
    }
    
    // Fetch apartments with filters and error handling
    let allApartments = [];
    try {
      allApartments = Object.keys(query).length > 0 
        ? await Apartment.find(query).lean()
        : await Apartment.find().lean();
      
      // Filter out invalid apartments
      allApartments = allApartments.filter(apt => {
        if (!apt || typeof apt !== 'object') {
          logger.warn('Found invalid apartment, filtering out');
          return false;
        }
        return true;
      });
    } catch (dbError) {
      logger.error('Error fetching apartments from database:', dbError);
      return res.status(500).json({ message: "Error fetching apartments" });
    }
    
    // Get total count for pagination
    const totalCount = allApartments.length;
    
    // Apply sorting before pagination
    let sortedApartments = [...allApartments];
    
    // We'll sort by match score later, so only apply database sorting for other fields
    if (sortBy === constants.SORT_OPTIONS.PRICE) {
      sortedApartments.sort((a, b) => {
        return sortOrder === constants.SORT_ORDER.ASC ? a.price - b.price : b.price - a.price;
      });
    } else if (sortBy === constants.SORT_OPTIONS.DATE_ADDED) {
      sortedApartments.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === constants.SORT_ORDER.ASC ? dateA - dateB : dateB - dateA;
      });
    }
    
    // Calculate match scores and explanations for sorted apartments
    // Use fallback explanations immediately for fast response
    // Process in batches to avoid blocking
    const scoredApartments = [];
    const BATCH_SIZE = 100; // Process 100 apartments at a time
    const MAX_APARTMENTS_TO_PROCESS = 1000; // Limit total processing to prevent timeout
    
    // If sorting by match score, we need to score all apartments first
    // Otherwise, we can optimize by only scoring what we need for pagination
    const needsFullScoring = sortBy === constants.SORT_OPTIONS.MATCH_SCORE;
    
    // Limit the number of apartments we process to prevent timeout
    const apartmentsToProcess = needsFullScoring 
      ? sortedApartments.slice(0, MAX_APARTMENTS_TO_PROCESS)
      : sortedApartments.slice(0, Math.min((page * limit) + 50, MAX_APARTMENTS_TO_PROCESS)); // Score a bit more than needed for pagination
    
    logger.debug(`Processing ${apartmentsToProcess.length} apartments (out of ${sortedApartments.length} total, needsFullScoring: ${needsFullScoring})`);
    
    // Process in batches with timeout protection
    for (let i = 0; i < apartmentsToProcess.length; i += BATCH_SIZE) {
      const batch = apartmentsToProcess.slice(i, i + BATCH_SIZE);
      
      // Process batch in parallel for better performance
      const batchResults = await Promise.all(
        batch.map(async (apt) => {
          try {
            // Validate apartment object
            if (!apt || typeof apt !== 'object') {
              return null;
            }
            
            // Calculate match score with error handling
            let score = 0;
            try {
              score = calculateMatchScore(pref, apt);
              // Ensure score is valid
              if (isNaN(score) || !isFinite(score) || score < 0 || score > 100) {
                score = 0;
              }
            } catch (scoreError) {
              logger.error('Error calculating match score:', scoreError);
              score = 0;
            }
            
            // Start with fallback explanation for immediate response
            let explanation = '';
            try {
              explanation = generateFallbackExplanation(pref, apt);
            } catch (fallbackError) {
              explanation = '✅ This listing may match some of your preferences';
            }
            
            // Try to get AI-generated explanation from Groq (optimized with caching and rate limiting)
            // Only for top matches to prioritize API usage
            let groqExplanation = null;
            try {
              // Only call Groq for apartments with match score >= 50 (top matches)
              // And only if Groq is available (not rate limited)
              if (score >= 50 && process.env.GROQ_API) {
                const { isGroqAvailable } = require("../../services/groqService");
                
                if (isGroqAvailable()) {
                  // Call Groq with caching enabled - won't make duplicate API calls
                  groqExplanation = await getMatchExplanation(pref, apt, true).catch(err => {
                    logger.debug('Groq explanation failed (non-critical):', err.message);
                    return null;
                  });
                  
                  // If we got a valid explanation, use it
                  if (groqExplanation && groqExplanation.trim() && 
                      groqExplanation !== "Could not generate explanation.") {
                    explanation = groqExplanation;
                  }
                }
              }
            } catch (groqError) {
              // Silently fail - fallback explanation will be used
              logger.debug('Groq explanation error (non-critical):', groqError.message);
            }
            
            // Use the best explanation available (Groq if successful, otherwise fallback)
            const finalExplanation = explanation || '✅ This listing may match some of your preferences';
            
            return {
              apartment: apt,
              matchScore: score,
              explanation: finalExplanation || '✅ This listing may match some of your preferences'
            };
          } catch (aptError) {
            logger.error('Error processing apartment in getMatches:', aptError);
            return null;
          }
        })
      );
      
      // Filter out null results and add to scoredApartments
      batchResults.forEach(result => {
        if (result !== null) {
          scoredApartments.push(result);
        }
      });
    }
    
    // If we limited processing and need full scoring, add remaining apartments with default scores
    if (needsFullScoring && sortedApartments.length > MAX_APARTMENTS_TO_PROCESS) {
      logger.debug(`Adding ${sortedApartments.length - MAX_APARTMENTS_TO_PROCESS} remaining apartments with default scores`);
      const remaining = sortedApartments.slice(MAX_APARTMENTS_TO_PROCESS);
      remaining.forEach(apt => {
        if (apt && typeof apt === 'object') {
          scoredApartments.push({
            apartment: apt,
            matchScore: 0,
            explanation: '✅ This listing may match some of your preferences'
          });
        }
      });
    }
    
    // Note: Groq API calls are now enabled with timeout protection
    // Fallback explanations are used first for instant response, then enhanced with Groq if available
    
    // If sorting by match score, apply it now
    if (sortBy === constants.SORT_OPTIONS.MATCH_SCORE) {
      scoredApartments.sort((a, b) => {
        return sortOrder === constants.SORT_ORDER.ASC ? a.matchScore - b.matchScore : b.matchScore - a.matchScore;
      });
    }
    
    // Apply pagination after all sorting and scoring
    const start = (page - 1) * limit;
    const paginatedResults = scoredApartments.slice(start, start + limit);
    
    const responseData = {
      results: paginatedResults,
      totalCount,
      filteredCount: scoredApartments.length
    };
    
    // Cache the results (non-blocking - don't wait if it fails)
    try {
      await setexAsync(cacheKey, constants.CACHE_TTL.MATCHES, JSON.stringify(responseData));
    } catch (cacheError) {
      logger.warn('Failed to cache match results:', cacheError.message);
      // Continue even if caching fails
    }
    
    // Send response immediately
    res.status(200).json(responseData);
    
  } catch (err) {
    logger.error("Error in getMatches:", err);
    
    // Ensure response is sent even on error
    if (!res.headersSent) {
      res.status(500).json({ 
        message: err.message || "Server error",
        error: "Failed to fetch matches"
      });
    }
  }
};

