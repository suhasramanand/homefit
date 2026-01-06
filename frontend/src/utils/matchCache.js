/**
 * Match Results Cache Utility
 * Stores and retrieves match results in localStorage
 * Only fetches new matches when preferences change
 */

const CACHE_KEY_PREFIX = 'match_results_';
const PREF_UPDATE_KEY = 'preference_updated_at_';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get cache key for a preference ID
 */
const getCacheKey = (prefId) => {
  return `${CACHE_KEY_PREFIX}${prefId}`;
};

/**
 * Get preference update timestamp key
 */
const getPrefUpdateKey = (prefId) => {
  return `${PREF_UPDATE_KEY}${prefId}`;
};

/**
 * Store match results in cache
 */
export const cacheMatchResults = (prefId, data, filters = {}) => {
  try {
    const cacheKey = getCacheKey(prefId);
    const filterKey = JSON.stringify(filters);
    const cacheData = {
      data,
      filters: filterKey,
      timestamp: Date.now(),
      prefId,
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to cache match results:', error);
  }
};

/**
 * Get cached match results
 */
export const getCachedMatchResults = (prefId, filters = {}) => {
  try {
    const cacheKey = getCacheKey(prefId);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    
    // Check if cache is expired
    const age = Date.now() - cacheData.timestamp;
    if (age > CACHE_EXPIRY_MS) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    // Check if filters match
    const filterKey = JSON.stringify(filters);
    if (cacheData.filters !== filterKey) {
      return null; // Filters changed, need new data
    }
    
    // Check if preference was updated after cache
    const prefUpdateKey = getPrefUpdateKey(prefId);
    const prefUpdateTime = localStorage.getItem(prefUpdateKey);
    if (prefUpdateTime && parseInt(prefUpdateTime) > cacheData.timestamp) {
      // Preferences were updated after cache was created
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return cacheData.data;
  } catch (error) {
    console.warn('Failed to get cached match results:', error);
    return null;
  }
};

/**
 * Mark preference as updated (clears cache)
 */
export const markPreferenceUpdated = (prefId) => {
  try {
    const prefUpdateKey = getPrefUpdateKey(prefId);
    localStorage.setItem(prefUpdateKey, Date.now().toString());
    
    // Clear cached matches for this preference
    const cacheKey = getCacheKey(prefId);
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.warn('Failed to mark preference as updated:', error);
  }
};

/**
 * Clear all match caches for a preference
 */
export const clearMatchCache = (prefId) => {
  try {
    const cacheKey = getCacheKey(prefId);
    localStorage.removeItem(cacheKey);
    markPreferenceUpdated(prefId);
  } catch (error) {
    console.warn('Failed to clear match cache:', error);
  }
};

/**
 * Clear all match caches (used on logout)
 */
export const clearAllMatchCaches = () => {
  try {
    const matchCacheKeys = Object.keys(localStorage).filter(key => 
      key.startsWith(CACHE_KEY_PREFIX) || key.startsWith(PREF_UPDATE_KEY)
    );
    matchCacheKeys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear all match caches:', error);
  }
};

/**
 * Check if we need to fetch new matches
 */
export const shouldFetchNewMatches = (prefId, filters = {}) => {
  const cached = getCachedMatchResults(prefId, filters);
  return cached === null;
};

export default {
  cacheMatchResults,
  getCachedMatchResults,
  markPreferenceUpdated,
  clearMatchCache,
  clearAllMatchCaches,
  shouldFetchNewMatches,
};

