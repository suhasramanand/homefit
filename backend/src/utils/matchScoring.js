// utils/matchScoring.js
/**
 * Robust matching algorithm with comprehensive edge case handling
 * Calculates match scores between user preferences and apartment listings
 */

const logger = require('./logger');

// ============================================================================
// SAFE UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely parse integer with fallback
 */
const safeParseInt = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const parsed = parseInt(value);
  return isNaN(parsed) || !isFinite(parsed) ? fallback : parsed;
};

/**
 * Safely parse float with fallback
 */
const safeParseFloat = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const parsed = parseFloat(value);
  return isNaN(parsed) || !isFinite(parsed) ? fallback : parsed;
};

/**
 * Safely convert to string
 */
const safeToString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  try {
    return String(value);
  } catch {
    return fallback;
  }
};

/**
 * Safely convert to lowercase
 */
const safeToLower = (value, fallback = '') => {
  const str = safeToString(value, fallback);
  try {
    return str.toLowerCase();
  } catch {
    return fallback;
  }
};

/**
 * Safely check if value is valid array
 */
const isArray = (value) => {
  return Array.isArray(value) && value.length > 0;
};

/**
 * Safely parse date
 */
const safeParseDate = (value) => {
  if (!value) return null;
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

// ============================================================================
// NORMALIZATION FUNCTIONS (with edge case handling)
// ============================================================================

const normalizeFloor = (value) => {
  if (value === null || value === undefined) return '';
  
  try {
    // Try to parse as number first
    const floor = safeParseInt(value, null);
    if (floor !== null) {
      if (floor <= 1) return 'Ground Floor';
      if (floor >= 2 && floor <= 5) return 'Mid-level Floor';
      return 'Top Floor';
    }
    
    // Handle string values
    const str = safeToLower(value);
    if (str.includes('ground')) return 'Ground Floor';
    if (str.includes('mid') || str.includes('middle')) return 'Mid-level Floor';
    if (str.includes('top') || str.includes('high')) return 'Top Floor';
    
    return safeToString(value);
  } catch (error) {
    logger.warn('Error normalizing floor:', error);
    return '';
  }
};

const normalizePets = (value) => {
  if (value === null || value === undefined) return '';
  
  try {
    const str = safeToLower(value);
    if (str.includes('no') || str.includes('not') || str.includes('prohibit')) return 'No';
    if (str.includes('yes') || str.includes('allow') || str.includes('permit')) return 'Yes';
    return 'Yes'; // Default to yes if unclear
  } catch (error) {
    logger.warn('Error normalizing pets:', error);
    return 'Yes';
  }
};

const normalizeRoommates = (val) => {
  if (val === null || val === undefined) return '';
  
  try {
    const str = safeToLower(val);
    if (str.includes('yes') || str.includes('with roommates') || str.includes('friends') || str.includes('shared')) {
      return 'Yes';
    }
    return 'No';
  } catch (error) {
    logger.warn('Error normalizing roommates:', error);
    return 'No';
  }
};

const normalizeBedrooms = (value) => {
  if (value === null || value === undefined) return '';
  
  try {
    // Extract just the number if it contains text
    const str = safeToString(value);
    const match = str.match(/(\d+)/);
    return match ? match[1] : str;
  } catch (error) {
    logger.warn('Error normalizing bedrooms:', error);
    return '';
  }
};

const normalizeParking = (value) => {
  if (value === null || value === undefined) return '';
  
  try {
    const str = safeToLower(value);
    if (str.includes('yes') || str.includes('need') || str.includes('require') || str.includes('available')) {
      return 'Yes';
    }
    if (str.includes('no') || str.includes('not') || str.includes('unavailable')) {
      return 'No';
    }
    return safeToString(value);
  } catch (error) {
    logger.warn('Error normalizing parking:', error);
    return '';
  }
};

const parsePriceRange = (range) => {
  if (!range || typeof range !== 'string') return [0, Infinity];
  
  try {
    // Handle "$3,000+" format
    if (range.includes('+')) {
      const minPrice = safeParseInt(range.replace(/[^\d]/g, ''), 0);
      return [minPrice, Infinity];
    }
    
    // Handle standard range format "$1,000-$2,000" or "1000-2000"
    const parts = range.split('-').map(s => safeParseInt(s.replace(/[^\d]/g, ''), 0));
    
    if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
      // Ensure min < max
      return parts[0] <= parts[1] ? parts : [parts[1], parts[0]];
    }
    
    // If only one number is found, assume it's the maximum
    if (parts.length === 1 && parts[0] > 0) {
      return [0, parts[0]];
    }
    
    return [0, Infinity]; // Default
  } catch (error) {
    logger.warn('Error parsing price range:', error);
    return [0, Infinity];
  }
};

const parseSqftRange = (range) => {
  if (!range || typeof range !== 'string') return [null, null];
  
  try {
    // Handle range formats like "500 - 1,000 sq. ft." or "500-1000"
    const numbers = range.match(/(\d+(?:,\d+)?)/g);
    
    if (numbers && numbers.length >= 2) {
      const min = safeParseInt(numbers[0].replace(/,/g, ''), null);
      const max = safeParseInt(numbers[1].replace(/,/g, ''), null);
      
      if (min !== null && max !== null && min > 0 && max > 0) {
        return min <= max ? [min, max] : [max, min];
      }
    }
    
    // Try to parse a single number
    if (numbers && numbers.length === 1) {
      const num = safeParseInt(numbers[0].replace(/,/g, ''), null);
      if (num !== null && num > 0) {
        return [num, num];
      }
    }
    
    return [null, null];
  } catch (error) {
    logger.warn('Error parsing sqft range:', error);
    return [null, null];
  }
};

const normalizeAmenities = (amenities) => {
  if (!Array.isArray(amenities)) return [];
  
  try {
    return amenities
      .filter(item => item !== null && item !== undefined)
      .map(item => {
        try {
          const str = safeToLower(item);
          // Normalize common amenity names
          if (str.includes('gym') || str.includes('fitness')) return 'Gym';
          if (str.includes('park') && str.includes('space')) return 'Parking Space';
          if (str.includes('balcon')) return 'Balcony';
          if (str.includes('laundry') || str.includes('washer') || str.includes('dryer')) {
            return 'In-Unit Laundry';
          }
          if (str.includes('dishwasher')) return 'Dishwasher';
          if (str.includes('air') && str.includes('condition')) return 'Air Conditioning';
          return safeToString(item).trim();
        } catch {
          return safeToString(item).trim();
        }
      })
      .filter(item => item.length > 0);
  } catch (error) {
    logger.warn('Error normalizing amenities:', error);
    return [];
  }
};

// ============================================================================
// MAIN MATCHING ALGORITHM
// ============================================================================

const calculateMatchScore = (pref, apt) => {
  // Input validation
  if (!pref || typeof pref !== 'object') {
    logger.warn('Invalid preference object in calculateMatchScore');
    return 0;
  }
  
  if (!apt || typeof apt !== 'object') {
    logger.warn('Invalid apartment object in calculateMatchScore');
    return 0;
  }

  let score = 0;
  let maxScore = 0;

  // Safe score adder with validation
  const addScore = (weight, isMatch) => {
    if (weight <= 0 || !isFinite(weight)) return; // Skip invalid weights
    
    maxScore += weight;
    
    if (isMatch === true) {
      score += weight;
    } else if (typeof isMatch === 'number' && isMatch >= 0 && isMatch <= 1) {
      // Partial match (0 to 1)
      score += weight * isMatch;
    }
    // If isMatch is false or invalid, don't add to score
  };

  try {
    // 1. Price Range - Higher weight (15)
    if (pref.priceRange && apt.price !== null && apt.price !== undefined) {
      const aptPrice = safeParseFloat(apt.price, 0);
      if (aptPrice > 0) {
        const [minPrice, maxPrice] = parsePriceRange(pref.priceRange);
        const isInRange = aptPrice >= minPrice && (maxPrice === Infinity || aptPrice <= maxPrice);
        addScore(15, isInRange);
      }
    }

    // 2. Bedrooms - Higher weight (15)
    const normalizedPrefBedrooms = normalizeBedrooms(pref.bedrooms);
    const normalizedAptBedrooms = normalizeBedrooms(apt.bedrooms);
    if (normalizedPrefBedrooms && normalizedAptBedrooms) {
      addScore(15, normalizedPrefBedrooms === normalizedAptBedrooms);
    }

    // 3. Neighborhood - Higher weight (10)
    if (pref.neighborhood && apt.neighborhood) {
      const prefNeighborhood = safeToLower(pref.neighborhood).trim();
      const aptNeighborhood = safeToLower(apt.neighborhood).trim();
      addScore(10, prefNeighborhood === aptNeighborhood);
    }

    // 4. Floor (normalized) - Weight 5
    const prefFloor = normalizeFloor(pref.floor);
    const aptFloor = normalizeFloor(apt.floor);
    if (prefFloor && aptFloor) {
      addScore(5, prefFloor === aptFloor);
    }

    // 5. Pets (normalized) - Weight 8
    const prefPets = normalizePets(pref.pets);
    const aptPets = normalizePets(apt.pets);
    if (prefPets && aptPets) {
      addScore(8, prefPets === aptPets);
    }

    // 6. Amenities (partial match) - Weight varies based on number of amenities
    if (isArray(pref.amenities) && isArray(apt.amenities)) {
      const normalizedPrefAmenities = normalizeAmenities(pref.amenities);
      const normalizedAptAmenities = normalizeAmenities(apt.amenities);
      
      if (normalizedPrefAmenities.length > 0) {
        // Count matching amenities (case-insensitive)
        const shared = normalizedAptAmenities.filter(item => 
          normalizedPrefAmenities.some(prefItem => 
            safeToLower(prefItem) === safeToLower(item)
          )
        ).length;
        
        const weightPerAmenity = 3;
        const totalAmenityWeight = normalizedPrefAmenities.length * weightPerAmenity;
        maxScore += totalAmenityWeight;
        
        // Calculate proportional score for amenities
        const amenityScore = (shared / normalizedPrefAmenities.length) * totalAmenityWeight;
        score += amenityScore;
      }
    }

    // 7. Style - Weight 5
    if (pref.style && apt.style) {
      const prefStyle = safeToLower(pref.style).trim();
      const aptStyle = safeToLower(apt.style).trim();
      addScore(5, prefStyle === aptStyle);
    }

    // 8. Move-in Date - Weight 8
    if (pref.moveInDate && apt.moveInDate) {
      const prefDate = safeParseDate(pref.moveInDate);
      const aptDate = safeParseDate(apt.moveInDate);
      
      if (prefDate && aptDate) {
        // Check if apartment is available before or on preferred move-in date
        addScore(8, aptDate <= prefDate);
      }
    }

    // 9. Parking - Weight 8
    const prefParking = normalizeParking(pref.parking);
    const aptParking = normalizeParking(apt.parking);
    if (prefParking && aptParking) {
      addScore(8, prefParking === aptParking);
    }

    // 10. Transport - Weight 5 (with partial matching)
    if (pref.transport && apt.transport) {
      const prefTransport = safeToLower(pref.transport);
      const aptTransport = safeToLower(apt.transport);
      
      // Full match
      if (prefTransport === aptTransport) {
        addScore(5, true);
      }
      // Partial match
      else if ((prefTransport.includes('important') && aptTransport.includes('good')) ||
               (prefTransport.includes('somewhat') && aptTransport.includes('average')) ||
               (prefTransport.includes('close') && aptTransport.includes('good'))) {
        addScore(5, 0.5); // Half points for close match
      }
      else {
        addScore(5, false);
      }
    }

    // 11. Sqft - Weight 6
    if (pref.sqft && apt.sqft) {
      const [minSqft, maxSqft] = parseSqftRange(pref.sqft);
      const aptSqft = safeParseInt(apt.sqft, null);
      
      if (aptSqft !== null && aptSqft > 0 && minSqft !== null && maxSqft !== null) {
        // Full match if within range
        if (aptSqft >= minSqft && aptSqft <= maxSqft) {
          addScore(6, true);
        }
        // Partial match if close to range (within 10%)
        else if (aptSqft >= minSqft * 0.9 && aptSqft <= maxSqft * 1.1) {
          addScore(6, 0.5); // Half points for close match
        }
        else {
          addScore(6, false);
        }
      }
    }

    // 12. Safety - Weight 7 (with fuzzy matching)
    if (pref.safety && apt.safety) {
      const prefSafety = safeToLower(pref.safety);
      const aptSafety = safeToLower(apt.safety);
      
      // Full match
      if (prefSafety === aptSafety) {
        addScore(7, true);
      }
      // Consider "Very Important" matches "High"
      else if ((prefSafety.includes('very') || prefSafety.includes('important')) && 
               (aptSafety.includes('high') || aptSafety.includes('good'))) {
        addScore(7, true);
      }
      // Consider "Somewhat Important" matches "Average"
      else if (prefSafety.includes('somewhat') && aptSafety.includes('average')) {
        addScore(7, true);
      }
      else {
        addScore(7, false);
      }
    }

    // 13. View - Weight 4
    if (pref.view && apt.view) {
      const prefView = safeToLower(pref.view).trim();
      const aptView = safeToLower(apt.view).trim();
      addScore(4, prefView === aptView);
    }

    // 14. Lease Capacity - Weight 8
    if (pref.leaseCapacity && apt.leaseCapacity) {
      const prefCapacity = safeToString(pref.leaseCapacity).trim();
      const aptCapacity = safeToString(apt.leaseCapacity).trim();
      addScore(8, prefCapacity === aptCapacity);
    }

    // 15. Roommates (normalized) - Weight 6
    const prefRoommates = normalizeRoommates(pref.roommates);
    const aptRoommates = normalizeRoommates(apt.roommates);
    if (prefRoommates && aptRoommates) {
      addScore(6, prefRoommates === aptRoommates);
    }

    // 16. Location/Distance - Weight 12 (Higher weight for proximity)
    if (pref.locationPreference && pref.locationPreference.center && 
        apt.location && apt.location.coordinates && Array.isArray(apt.location.coordinates)) {
      try {
        const prefCenter = pref.locationPreference.center; // [lng, lat]
        const aptCoords = apt.location.coordinates; // [lng, lat]
        const radius = pref.locationPreference.radius || 10; // Default 10km
        
        // Validate coordinates
        if (Array.isArray(prefCenter) && prefCenter.length >= 2 &&
            Array.isArray(aptCoords) && aptCoords.length >= 2) {
          
          const prefLng = safeParseFloat(prefCenter[0]);
          const prefLat = safeParseFloat(prefCenter[1]);
          const aptLng = safeParseFloat(aptCoords[0]);
          const aptLat = safeParseFloat(aptCoords[1]);
          
          // Check if coordinates are valid
          if (prefLng >= -180 && prefLng <= 180 && prefLat >= -90 && prefLat <= 90 &&
              aptLng >= -180 && aptLng <= 180 && aptLat >= -90 && aptLat <= 90) {
            
            // Calculate distance using Haversine formula (in kilometers)
            const R = 6371; // Earth's radius in km
            const dLat = (aptLat - prefLat) * Math.PI / 180;
            const dLng = (aptLng - prefLng) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(prefLat * Math.PI / 180) * Math.cos(aptLat * Math.PI / 180) *
                      Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c; // Distance in kilometers
            
            // Score based on distance within radius
            if (distance <= radius) {
              // Within radius - score based on how close (closer = higher score)
              const distanceRatio = distance / radius; // 0 to 1 (0 = at center, 1 = at edge)
              const locationScore = 1 - (distanceRatio * 0.5); // 1.0 at center, 0.5 at edge
              addScore(12, locationScore);
            } else {
              // Outside radius - partial score based on how far beyond
              const excessDistance = distance - radius;
              const maxExcess = radius * 2; // Allow up to 2x radius for partial score
              if (excessDistance <= maxExcess) {
                const excessRatio = excessDistance / maxExcess; // 0 to 1
                const locationScore = 0.5 * (1 - excessRatio); // 0.5 at radius edge, 0 at 2x radius
                addScore(12, locationScore);
              } else {
                // Too far away - no score
                addScore(12, false);
              }
            }
          }
        }
      } catch (locationError) {
        logger.warn('Error calculating location score:', locationError);
        // Don't add location score if calculation fails
      }
    }

    // ========================================================================
    // FINAL SCORE CALCULATION (with edge case handling)
    // ========================================================================
    
    // Prevent division by zero
    if (maxScore === 0) {
      logger.warn('Max score is 0 in calculateMatchScore');
      return 0;
    }
    
    // Ensure score is non-negative
    score = Math.max(0, score);
    
    // Extra boost for perfect matches
    if (score === maxScore && maxScore > 0) {
      return 100;
    }
    
    // Calculate percentage score
    const percentScore = Math.round((score / maxScore) * 100);
    
    // Ensure minimum score of 30% if at least half the criteria match
    if (score >= (maxScore * 0.5) && percentScore < 30) {
      return 30;
    }
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, percentScore));
    
  } catch (error) {
    logger.error('Error in calculateMatchScore:', error);
    // Return a safe default score instead of crashing
    return 0;
  }
};

module.exports = {
  calculateMatchScore,
};
