/**
 * MBTA API Service
 * Fetches nearby bus stops using the backend proxy (avoids CORS issues)
 * The backend proxies requests to the MBTA API v3
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

/**
 * Fetch nearby bus stops within a radius
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in meters (default: 500)
 * @returns {Promise<Array>} Array of bus stops sorted by distance
 * 
 * Reference: https://api-v3.mbta.com/docs/swagger/index.html#/Stop/ApiWeb_StopController_index
 */
export const fetchNearbyBusStops = async (lat, lng, radius = 500) => {
  try {
    // Validate inputs
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid latitude or longitude');
    }

    // Use backend proxy to avoid CORS issues
    const response = await axios.get(`${API_BASE_URL}/api/user/mbta/stops`, {
      params: {
        lat,
        lng,
        radius,
      },
      withCredentials: true, // Include session cookie for authentication
      timeout: 10000, // 10 second timeout
    });

    if (response.data && response.data.stops) {
      // Stops are already sorted by distance from backend
      return response.data.stops;
    }

    return [];
  } catch (error) {
    console.error('Error fetching MBTA bus stops:', error);
    
    // Provide more specific error messages
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        throw new Error('Please log in to view bus stop information.');
      } else if (status === 429) {
        throw new Error('Too many requests. Please try again in a moment.');
      } else if (status >= 500) {
        throw new Error(data?.error || 'Service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(data?.error || 'Failed to fetch bus stops');
      }
    }
    
    if (error.request) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    
    throw new Error(error.message || 'Failed to fetch nearby bus stops');
  }
};

/**
 * Fetch routes for a specific stop
 * @param {string} stopId - MBTA stop ID
 * @returns {Promise<Array>} Array of routes
 * 
 * Reference: https://api-v3.mbta.com/docs/swagger/index.html#/Route/ApiWeb_RouteController_index
 */
export const fetchStopRoutes = async (stopId) => {
  try {
    if (!stopId) {
      return [];
    }

    // Use backend proxy to avoid CORS issues
    const response = await axios.get(`${API_BASE_URL}/api/user/mbta/routes/${stopId}`, {
      withCredentials: true, // Include session cookie for authentication
      timeout: 10000, // 10 second timeout
    });

    if (response.data && response.data.routes) {
      return response.data.routes;
    }

    return [];
  } catch (error) {
    console.error('Error fetching stop routes:', error);
    // Don't throw - return empty array so bus stop info still shows
    return [];
  }
};

/**
 * Fetch nearby stops with route information
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in meters
 * @returns {Promise<Array>} Array of stops with route information
 */
export const fetchNearbyStopsWithRoutes = async (lat, lng, radius = 500) => {
  try {
    const stops = await fetchNearbyBusStops(lat, lng, radius);
    
    // Fetch routes for each stop (limit to first 5 to avoid too many API calls)
    const stopsWithRoutes = await Promise.all(
      stops.slice(0, 10).map(async (stop) => {
        try {
          const routes = await fetchStopRoutes(stop.id);
          return {
            ...stop,
            routes: routes.slice(0, 5), // Limit to 5 routes per stop
          };
        } catch (error) {
          return {
            ...stop,
            routes: [],
          };
        }
      })
    );

    return stopsWithRoutes;
  } catch (error) {
    console.error('Error fetching stops with routes:', error);
    throw error;
  }
};

const mbtaService = {
  fetchNearbyBusStops,
  fetchStopRoutes,
  fetchNearbyStopsWithRoutes,
};

export default mbtaService;

