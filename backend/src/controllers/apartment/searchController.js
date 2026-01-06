/**
 * Apartment search and location-based operations
 */

const Apartment = require("../../models/Apartment");
const Preference = require("../../models/Preference");
const { calculateMatchScore } = require("../../utils/matchScoring");
const { getMatchExplanation } = require("../../services/groqService");
const logger = require("../../utils/logger");
const constants = require("../../utils/constants");
const validator = require("../../utils/validators");
const { generateFallbackExplanation } = require("../user/matchUtils");

/**
 * Get apartments near location
 */
exports.getNearbyApartments = async (req, res) => {
  try {
    const { longitude, latitude, radius = 5 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: "Missing location coordinates" });
    }

    // Convert string values to numbers
    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const radiusInKm = parseFloat(radius);

    // Validate coordinates
    if (!validator.isValidCoordinates(lat, lng)) {
      return res.status(400).json({ 
        message: `Invalid coordinates. Latitude must be between ${constants.COORDINATES.MIN_LATITUDE} and ${constants.COORDINATES.MAX_LATITUDE}, longitude between ${constants.COORDINATES.MIN_LONGITUDE} and ${constants.COORDINATES.MAX_LONGITUDE}` 
      });
    }

    // Validate radius
    if (!validator.isInRange(radiusInKm, constants.VALIDATION.MIN_RADIUS_KM, constants.VALIDATION.MAX_RADIUS_KM)) {
      return res.status(400).json({ 
        message: `Radius must be between ${constants.VALIDATION.MIN_RADIUS_KM} and ${constants.VALIDATION.MAX_RADIUS_KM} km` 
      });
    }

    // Find apartments within radius using geospatial query
    const apartments = await Apartment.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: radiusInKm * 1000 // Convert km to meters
        }
      },
      isActive: true
    });

    res.status(200).json(apartments);
  } catch (error) {
    logger.error("Error finding nearby apartments:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * Get matches by user email (legacy - use preferencesController.getMatches instead)
 */
exports.getMatchesByUserEmail = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const pref = await Preference.findOne({ userEmail }).sort({ submittedAt: -1 });
    
    if (!pref) {
      return res.status(404).json({ message: "Preferences not found" });
    }

    const apartments = await Apartment.find({ isActive: true });
    const scored = apartments.map(apt => ({
      apartment: apt,
      matchScore: calculateMatchScore(pref, apt)
    }));

    scored.sort((a, b) => b.matchScore - a.matchScore);
    res.status(200).json(scored);
  } catch (err) {
    logger.error("Match error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

