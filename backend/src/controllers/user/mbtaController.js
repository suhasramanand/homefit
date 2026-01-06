/**
 * MBTA API Proxy Controller
 * Proxies MBTA API requests to avoid CORS issues and keep API key secure
 */

const axios = require('axios');
const logger = require('../../utils/logger');

const MBTA_API_KEY = process.env.MBTA_API_KEY || 'REPLACED_API_KEY';
const MBTA_BASE_URL = 'https://api-v3.mbta.com';

/**
 * Calculate distance between two coordinates using Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

/**
 * Get nearby bus stops
 * GET /api/user/mbta/stops?lat=42.35&lng=-71.08&radius=500
 */
exports.getNearbyBusStops = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radius = parseFloat(req.query.radius) || 500; // meters

    // Validate inputs
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    // Convert radius from meters to miles (MBTA API uses miles)
    const radiusInMiles = radius / 1609.34;

    // Fetch stops from MBTA API
    const response = await axios.get(`${MBTA_BASE_URL}/stops`, {
      params: {
        'filter[latitude]': lat,
        'filter[longitude]': lng,
        'filter[radius]': radiusInMiles.toFixed(2),
        'filter[route_type]': '3', // Bus stops only
        'api_key': MBTA_API_KEY,
      },
      timeout: 10000,
      headers: {
        'Accept': 'application/vnd.api+json',
      },
    });

    if (response.data && response.data.data) {
      // Map stops and calculate distance
      const stops = response.data.data.map((stop) => {
        const stopLat = parseFloat(stop.attributes.latitude);
        const stopLng = parseFloat(stop.attributes.longitude);
        const distance = calculateDistance(lat, lng, stopLat, stopLng);

        return {
          id: stop.id,
          name: stop.attributes.name,
          description: stop.attributes.description,
          latitude: stopLat,
          longitude: stopLng,
          wheelchairAccessible: stop.attributes.wheelchair_boarding === 1,
          address: stop.attributes.address || null,
          atStreet: stop.attributes.at_street || null,
          onStreet: stop.attributes.on_street || null,
          municipality: stop.attributes.municipality || null,
          distance, // Distance in meters
        };
      });

      // Sort by distance (closest first)
      stops.sort((a, b) => a.distance - b.distance);

      return res.status(200).json({ stops });
    }

    return res.status(200).json({ stops: [] });
  } catch (error) {
    logger.error('Error fetching MBTA bus stops:', error);

    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        return res.status(500).json({ error: 'MBTA API authentication failed' });
      } else if (status === 429) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      } else if (status >= 500) {
        return res.status(502).json({ error: 'MBTA service is temporarily unavailable' });
      }
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Request timed out' });
    }

    return res.status(500).json({ error: 'Failed to fetch bus stops' });
  }
};

/**
 * Get routes for a specific stop
 * GET /api/user/mbta/routes/:stopId
 */
exports.getStopRoutes = async (req, res) => {
  try {
    const { stopId } = req.params;

    if (!stopId) {
      return res.status(400).json({ error: 'Stop ID is required' });
    }

    const response = await axios.get(`${MBTA_BASE_URL}/routes`, {
      params: {
        'filter[stop]': stopId,
        'api_key': MBTA_API_KEY,
      },
      timeout: 10000,
      headers: {
        'Accept': 'application/vnd.api+json',
      },
    });

    if (response.data && response.data.data) {
      const routes = response.data.data.map((route) => ({
        id: route.id,
        name: route.attributes.long_name || route.attributes.short_name,
        shortName: route.attributes.short_name,
        color: route.attributes.color ? `#${route.attributes.color}` : '#1976d2',
        textColor: route.attributes.text_color ? `#${route.attributes.text_color}` : '#ffffff',
        type: route.attributes.type,
        description: route.attributes.description || null,
      }));

      return res.status(200).json({ routes });
    }

    return res.status(200).json({ routes: [] });
  } catch (error) {
    logger.error('Error fetching stop routes:', error);

    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        return res.status(500).json({ error: 'MBTA API authentication failed' });
      } else if (status === 429) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
      } else if (status >= 500) {
        return res.status(502).json({ error: 'MBTA service is temporarily unavailable' });
      }
    }

    return res.status(500).json({ error: 'Failed to fetch routes' });
  }
};

