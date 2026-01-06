/**
 * Utility functions for matching apartments with preferences
 */

const logger = require("../../utils/logger");

/**
 * Generate a simple fallback explanation when Groq API fails
 * @param {Object} pref - User preference object
 * @param {Object} apt - Apartment object
 * @returns {String} - Simple formatted explanation with check marks
 */
function generateFallbackExplanation(pref, apt) {
  const highlights = [];
  
  // Input validation
  if (!pref || typeof pref !== 'object') {
    return '✅ This listing may match some of your preferences';
  }
  
  if (!apt || typeof apt !== 'object') {
    return '✅ This listing may match some of your preferences';
  }
  
  try {
    // Check price match
    if (pref.priceRange && apt.price !== null && apt.price !== undefined) {
      try {
        const aptPrice = parseFloat(apt.price);
        if (!isNaN(aptPrice) && aptPrice > 0) {
          // For "$3,000+" format
          if (typeof pref.priceRange === 'string' && pref.priceRange.includes('+')) {
            const minPrice = parseInt(pref.priceRange.replace(/[^\d]/g, ''));
            if (!isNaN(minPrice) && aptPrice >= minPrice) {
              highlights.push("Within your budget range");
            }
          } 
          // For regular range
          else if (typeof pref.priceRange === 'string' && pref.priceRange.includes('-')) {
            const priceRange = pref.priceRange.split('-').map(p => parseInt(p.replace(/[^\d]/g, '')));
            if (priceRange.length === 2 && !priceRange.some(isNaN)) {
              if (aptPrice >= priceRange[0] && aptPrice <= priceRange[1]) {
                highlights.push("Within your budget range");
              }
            }
          }
        }
      } catch (error) {
        logger.warn('Error checking price match in fallback explanation:', error);
      }
    }
    
    // Check bedrooms match
    if (pref.bedrooms && apt.bedrooms) {
      try {
        // Extract number from potential formats like "3 Bedrooms"
        const prefBedroomsMatch = String(pref.bedrooms).match(/(\d+)/);
        const prefBedrooms = prefBedroomsMatch ? prefBedroomsMatch[1] : String(pref.bedrooms);
        
        const aptBedroomsMatch = String(apt.bedrooms).match(/(\d+)/);
        const aptBedrooms = aptBedroomsMatch ? aptBedroomsMatch[1] : String(apt.bedrooms);
        
        if (prefBedrooms && aptBedrooms && prefBedrooms === aptBedrooms) {
          highlights.push("Has your required bedrooms");
        }
      } catch (error) {
        logger.warn('Error checking bedrooms match in fallback explanation:', error);
      }
    }
    
    // Check neighborhood match
    if (pref.neighborhood && apt.neighborhood) {
      try {
        const prefNeighborhood = String(pref.neighborhood).toLowerCase().trim();
        const aptNeighborhood = String(apt.neighborhood).toLowerCase().trim();
        if (prefNeighborhood === aptNeighborhood) {
          highlights.push("In your preferred neighborhood");
        }
      } catch (error) {
        logger.warn('Error checking neighborhood match in fallback explanation:', error);
      }
    }
    
    // Check move-in date
    if (pref.moveInDate && apt.moveInDate) {
      try {
        const prefDate = new Date(pref.moveInDate);
        const aptDate = new Date(apt.moveInDate);
        if (!isNaN(prefDate.getTime()) && !isNaN(aptDate.getTime()) && aptDate <= prefDate) {
          highlights.push("Available within your timeframe");
        }
      } catch (error) {
        logger.warn('Error checking move-in date in fallback explanation:', error);
      }
    }
    
    // Check amenities matches
    if (Array.isArray(pref.amenities) && Array.isArray(apt.amenities) && 
        pref.amenities.length > 0 && apt.amenities.length > 0) {
      try {
        const matchingAmenities = apt.amenities.filter(item => {
          if (!item) return false;
          const itemLower = String(item).toLowerCase();
          return pref.amenities.some(prefItem => {
            if (!prefItem) return false;
            const prefItemLower = String(prefItem).toLowerCase();
            return prefItemLower.includes(itemLower) || itemLower.includes(prefItemLower);
          });
        });
        
        if (matchingAmenities.length > 0) {
          if (matchingAmenities.length === pref.amenities.length) {
            highlights.push("Has all your desired amenities");
          } else {
            highlights.push(`Has ${matchingAmenities.length} of your desired amenities`);
          }
        }
      } catch (error) {
        logger.warn('Error checking amenities match in fallback explanation:', error);
      }
    }
    
    // If no highlights, provide a generic message
    if (highlights.length === 0) {
      highlights.push("This listing may match some of your preferences");
    }
    
    // Format the result with check marks
    return highlights.map(highlight => `✅ ${highlight}`).join('\n');
  } catch (error) {
    logger.error('Error in generateFallbackExplanation:', error);
    return '✅ This listing may match some of your preferences';
  }
}

/**
 * Clear matches cache for a preference
 */
async function clearMatchesCache(prefId) {
  try {
    // Try to use Redis client to get all matching keys
    try {
      if (!redisClient.isOpen) {
        logger.warn("Redis not available, skipping cache clear");
        return;
      }
      const keys = await redisClient.keys(`matches:${prefId}:*`);
      
      if (keys && keys.length > 0) {
        // Delete all matching keys
        await redisClient.del(keys);
        logger.debug(`Cleared ${keys.length} cache entries for preference ${prefId}`);
        return;
      }
    } catch (keysError) {
      logger.warn("Error using redisClient.keys, using fallback:", keysError.message);
      // Fall through to backup method
    }
    
    // Backup method: try to clear individual keys for common page/limit combinations
    logger.debug(`Using fallback method to clear cache for preference ${prefId}`);
    const { delAsync } = require('../../utils/redisClient');
    const constants = require('../../utils/constants');
    const limits = [3, constants.PAGINATION.DEFAULT_LIMIT];
    
    for (let limit of limits) {
      for (let page = 1; page <= 10; page++) {
        const cacheKey = `matches:${prefId}:page${page}:limit${limit}`;
        await delAsync(cacheKey);
      }
    }
    
    logger.debug(`Completed fallback cache clearing for preference ${prefId}`);
  } catch (err) {
    logger.error("Error clearing cache:", err);
  }
}

module.exports = {
  generateFallbackExplanation,
  clearMatchesCache
};

