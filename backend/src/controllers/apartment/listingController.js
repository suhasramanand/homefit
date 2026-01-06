/**
 * Apartment listing CRUD operations
 */

const Apartment = require("../../models/Apartment");
const logger = require("../../utils/logger");
const constants = require("../../utils/constants");
const validator = require("../../utils/validators");
const { geocodeAddressToCoordinates, areCoordinatesValid } = require("../../utils/geocoding");

/**
 * Create apartment
 */
exports.createApartment = async (req, res) => {
  try {
    // Add broker email and ID from session
    const brokerEmail = req.session?.user?.email;
    const brokerId = req.session?.user?._id;
    
    if (!brokerEmail || !brokerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Check if user is a broker
    if (req.session.user.type !== constants.USER_TYPES.BROKER) {
      return res.status(403).json({ message: "Only brokers can create listings" });
    }

    // Format location data if provided
    let formattedData = { ...req.body };
    if (req.body.location) {
      const address = req.body.location.address || '';
      let coordinates = req.body.location.coordinates;
      
      // Check if coordinates are valid
      const hasValidCoordinates = coordinates && 
                                   Array.isArray(coordinates) && 
                                   areCoordinatesValid(coordinates);
      
      // If coordinates are missing or invalid, but we have an address, geocode it
      if (!hasValidCoordinates && address && address.trim().length > 0) {
        logger.info(`Geocoding address for new apartment: ${address}`);
        const geocodedCoords = await geocodeAddressToCoordinates(address);
        if (geocodedCoords) {
          coordinates = geocodedCoords;
          logger.info(`Successfully geocoded address: ${address} -> [${geocodedCoords[0]}, ${geocodedCoords[1]}]`);
        } else {
          logger.warn(`Failed to geocode address: ${address}. Using provided coordinates or default.`);
        }
      }
      
      // Ensure coordinates are proper numbers
      if (coordinates && Array.isArray(coordinates)) {
        formattedData.location = {
          type: 'Point',
          coordinates: [
            parseFloat(coordinates[0]),
            parseFloat(coordinates[1])
          ],
          address: address || ''
        };
      } else if (hasValidCoordinates) {
        // Use the provided coordinates if they were valid
        formattedData.location = {
          type: 'Point',
          coordinates: [
            parseFloat(coordinates[0]),
            parseFloat(coordinates[1])
          ],
          address: address || ''
        };
      }
    }

    // Validate image URLs if provided
    if (req.body.imageUrls && Array.isArray(req.body.imageUrls)) {
      // Filter out invalid URLs
      formattedData.imageUrls = req.body.imageUrls.filter(url => 
        typeof url === 'string' && url.trim().length > 0
      );
      logger.debug("Processing image URLs:", { count: formattedData.imageUrls.length });
    }

    const apartmentData = {
      ...formattedData,
      brokerEmail,
      broker: brokerId 
    };

    // Validate required fields (price already validated by validateApartment middleware)
    if (!apartmentData.price || apartmentData.price < constants.VALIDATION.MIN_PRICE || apartmentData.price > constants.VALIDATION.MAX_PRICE) {
      return res.status(400).json({ message: `Price must be between ${constants.VALIDATION.MIN_PRICE} and ${constants.VALIDATION.MAX_PRICE}` });
    }
    
    // Neighborhood already validated and sanitized by validateApartment middleware

    logger.info("Creating apartment:", { 
      brokerEmail, 
      imageCount: apartmentData.imageUrls?.length || 0 
    });

    const apartment = await Apartment.create(apartmentData);
    res.status(201).json(apartment);
  } catch (error) {
    logger.error("Error creating apartment:", error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(400).json({ message: error.message || "Failed to create apartment" });
  }
};

/**
 * Get all apartments
 */
exports.getAllApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find({ isActive: true });
    res.status(200).json(apartments);
  } catch (error) {
    logger.error("Error fetching apartments:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * Get apartment by ID
 */
exports.getApartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findById(id);
    
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    
    res.status(200).json(apartment);
  } catch (error) {
    logger.error("Error fetching apartment:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid apartment ID" });
    }
    
    res.status(500).json({ message: "Failed to fetch apartment details" });
  }
};

/**
 * Update apartment
 */
exports.updateApartment = async (req, res) => {
  try {
    const { id: apartmentId } = req.params;
    const brokerEmail = req.session?.user?.email;
    const brokerId = req.session?.user?._id;
    
    if (!brokerEmail || !brokerId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Check if the listing belongs to the logged-in broker
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment || apartment.brokerEmail !== brokerEmail) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    // Format location data if provided
    let formattedData = { ...req.body };
    if (req.body.location) {
      const address = req.body.location.address || apartment.location?.address || '';
      let coordinates = req.body.location.coordinates;
      
      // Check if coordinates are valid
      const hasValidCoordinates = coordinates && 
                                   Array.isArray(coordinates) && 
                                   areCoordinatesValid(coordinates);
      
      // If coordinates are missing or invalid, but we have an address, geocode it
      if (!hasValidCoordinates && address && address.trim().length > 0) {
        logger.info(`Geocoding address for apartment update: ${address}`);
        const geocodedCoords = await geocodeAddressToCoordinates(address);
        if (geocodedCoords) {
          coordinates = geocodedCoords;
          logger.info(`Successfully geocoded address: ${address} -> [${geocodedCoords[0]}, ${geocodedCoords[1]}]`);
        } else {
          logger.warn(`Failed to geocode address: ${address}. Using existing coordinates.`);
          // Fall back to existing coordinates if geocoding fails
          coordinates = apartment.location?.coordinates;
        }
      }
      
      // Ensure coordinates are proper numbers
      if (coordinates && Array.isArray(coordinates)) {
        formattedData.location = {
          type: 'Point',
          coordinates: [
            parseFloat(coordinates[0]),
            parseFloat(coordinates[1])
          ],
          address: address
        };
      } else if (apartment.location) {
        // Keep existing location if no new valid data provided
        formattedData.location = apartment.location;
      }
    }

    // Make sure to preserve the broker reference
    formattedData.broker = brokerId;

    // Validate required fields
    if (formattedData.price !== undefined && (formattedData.price < constants.VALIDATION.MIN_PRICE || formattedData.price > constants.VALIDATION.MAX_PRICE)) {
      return res.status(400).json({ message: `Price must be between ${constants.VALIDATION.MIN_PRICE} and ${constants.VALIDATION.MAX_PRICE}` });
    }

    const updated = await Apartment.findByIdAndUpdate(apartmentId, formattedData, { 
      new: true,
      runValidators: true 
    });
    
    logger.info('Apartment updated:', { apartmentId, brokerEmail });
    res.status(200).json(updated);
  } catch (error) {
    logger.error("Update error:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: error.message || "Failed to update apartment" });
  }
};

/**
 * Get broker's apartments
 */
exports.getBrokerApartments = async (req, res) => {
  try {
    const brokerEmail = req.session.user?.email;
    if (!brokerEmail) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const apartments = await Apartment.find({ brokerEmail })
      .sort({ createdAt: -1 });

    // Enrich with inquiry counts
    const Inquiry = require("../../models/Inquiry");
    const enrichedApartments = await Promise.all(
      apartments.map(async (apt) => {
        const inquiryCount = await Inquiry.countDocuments({ apartmentId: apt._id });
        return {
          ...apt.toObject(),
          inquiries: inquiryCount
        };
      })
    );

    res.status(200).json(enrichedApartments);
  } catch (error) {
    logger.error("Error fetching broker apartments:", error);
    res.status(500).json({ message: "Failed to fetch apartments" });
  }
};

/**
 * Get featured apartments
 */
exports.getFeaturedApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find({ 
      isActive: true,
      isFeatured: true 
    })
      .sort({ createdAt: -1 })
      .limit(6);
    
    res.status(200).json(apartments);
  } catch (error) {
    logger.error("Error fetching featured apartments:", error);
    res.status(500).json({ message: "Failed to fetch featured apartments" });
  }
};

