/**
 * Saved apartments-related controller functions
 */

const User = require("../../models/User");
const Apartment = require("../../models/Apartment");
const logger = require("../../utils/logger");
const constants = require("../../utils/constants");

/**
 * Save or unsave apartment
 */
exports.toggleSaveApartment = async (req, res) => {
  try {
    const { apartmentId } = req.body;
    const email = req.session.user?.email;
    
    if (!email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!apartmentId) {
      return res.status(400).json({ error: "Apartment ID is required" });
    }

    // Validate apartment ID format (MongoDB ObjectId is 24 hex characters)
    if (!apartmentId || typeof apartmentId !== 'string' || apartmentId.length !== 24) {
      return res.status(400).json({ error: "Invalid apartment ID format" });
    }

    // Verify apartment exists and is active
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      logger.warn('Apartment not found:', { apartmentId, email });
      return res.status(404).json({ error: "Apartment not found" });
    }
    
    if (!apartment.isActive || apartment.approvalStatus !== 'approved') {
      logger.warn('Apartment not available:', { apartmentId, isActive: apartment.isActive, approvalStatus: apartment.approvalStatus });
      return res.status(404).json({ error: "Apartment is not available" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure it's an array
    if (!Array.isArray(user.savedApartments)) {
      user.savedApartments = [];
    }

    // Use `toString()` comparison instead of `includes()`
    const isSaved = user.savedApartments.some(
      id => id?.toString() === apartmentId
    );

    if (isSaved) {
      user.savedApartments = user.savedApartments.filter(
        id => id?.toString() !== apartmentId
      );
      await user.save();
      logger.info('Apartment removed from saved:', { email, apartmentId });
      return res.status(200).json({ message: "Apartment removed from saved" });
    } else {
      // Check if already at limit
      if (user.savedApartments.length >= constants.VALIDATION.MAX_SAVED_APARTMENTS) {
        return res.status(400).json({ error: `Maximum ${constants.VALIDATION.MAX_SAVED_APARTMENTS} saved apartments allowed` });
      }
      
      user.savedApartments.push(apartmentId);
      await user.save();
      logger.info('Apartment saved:', { email, apartmentId });
      return res.status(200).json({ message: "Apartment saved successfully" });
    }
  } catch (err) {
    logger.error("Toggle Save Error:", err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid apartment ID format" });
    }
    
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Fetch all saved apartments
 */
exports.getSavedApartments = async (req, res) => {
  try {
    const email = req.session.user?.email;
    if (!email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ email }).populate("savedApartments");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter out null/invalid apartment references
    const validApartments = (user.savedApartments || []).filter(
      apt => apt !== null && apt !== undefined && apt.isActive !== false
    );

    res.status(200).json(validApartments);
  } catch (err) {
    logger.error("Fetch Saved Apartments Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

