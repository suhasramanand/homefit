/**
 * Geocoding utility for converting addresses to coordinates
 * Uses Google Maps Geocoding API
 */

const axios = require('axios');
const logger = require('./logger');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

/**
 * Geocode an address to get coordinates
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number, formattedAddress: string} | null>}
 */
async function geocodeAddress(address) {
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    logger.warn('Geocoding: Empty or invalid address provided');
    return null;
  }

  if (!GOOGLE_MAPS_API_KEY) {
    logger.warn('Geocoding: Google Maps API key not configured');
    return null;
  }

  try {
    const response = await axios.get(GEOCODING_API_URL, {
      params: {
        address: address.trim(),
        key: GOOGLE_MAPS_API_KEY,
      },
      timeout: 10000, // 10 second timeout
    });

    if (response.data.status === 'OK' && response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const location = result.geometry.location;
      
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: result.formatted_address,
      };
    } else if (response.data.status === 'ZERO_RESULTS') {
      logger.warn(`Geocoding: No results found for address: ${address}`);
      return null;
    } else {
      logger.warn(`Geocoding: API returned status ${response.data.status} for address: ${address}`);
      return null;
    }
  } catch (error) {
    logger.error('Geocoding error:', error.message);
    if (error.response) {
      logger.error('Geocoding API response:', error.response.data);
    }
    return null;
  }
}

/**
 * Geocode an address and return coordinates in GeoJSON format [longitude, latitude]
 * @param {string} address - The address to geocode
 * @returns {Promise<[number, number] | null>}
 */
async function geocodeAddressToCoordinates(address) {
  const result = await geocodeAddress(address);
  if (result) {
    // Return in GeoJSON format: [longitude, latitude]
    return [result.lng, result.lat];
  }
  return null;
}

/**
 * Validate if coordinates are reasonable for a given address
 * This is a basic check - coordinates should not be (0, 0) or obviously wrong
 * @param {number[]} coordinates - [longitude, latitude]
 * @returns {boolean}
 */
function areCoordinatesValid(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return false;
  }
  
  const lng = parseFloat(coordinates[0]);
  const lat = parseFloat(coordinates[1]);
  
  // Check if coordinates are valid numbers
  if (isNaN(lng) || isNaN(lat) || !isFinite(lng) || !isFinite(lat)) {
    return false;
  }
  
  // Check if coordinates are within valid ranges
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return false;
  }
  
  // Check if coordinates are not (0, 0) which is likely invalid
  if (lat === 0 && lng === 0) {
    return false;
  }
  
  return true;
}

module.exports = {
  geocodeAddress,
  geocodeAddressToCoordinates,
  areCoordinatesValid,
};

