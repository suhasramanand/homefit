/**
 * Broker listing management controller
 */

const Apartment = require("../../models/Apartment");
const Inquiry = require("../../models/Inquiry");
const logger = require("../../utils/logger");
const validator = require("../../utils/validators");

/**
 * Get broker's listings
 */
exports.getBrokerListings = async (req, res) => {
  try {
    const brokerEmail = req.session.user?.email;
    if (!brokerEmail) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const listings = await Apartment.find({ brokerEmail })
      .sort({ createdAt: -1 });

    // Enrich listings with inquiry counts
    const enrichedListings = await Promise.all(
      listings.map(async (listing) => {
        const inquiryCount = await Inquiry.countDocuments({ apartmentId: listing._id });
        
        return {
          ...listing.toObject(),
          inquiries: inquiryCount
        };
      })
    );

    res.status(200).json(enrichedListings);
  } catch (error) {
    logger.error('Error fetching broker listings:', error);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
};

/**
 * Get broker listing by ID
 */
exports.getBrokerListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const brokerEmail = req.session.user?.email;
    
    if (!brokerEmail) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Validate ID format
    if (!validator.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid listing ID format' });
    }

    const listing = await Apartment.findById(id);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    if (listing.brokerEmail !== brokerEmail) {
      return res.status(403).json({ message: 'You do not have permission to view this listing' });
    }
    
    // Get inquiry count for this listing
    const inquiryCount = await Inquiry.countDocuments({ apartmentId: id });
    
    // Enrich the listing with additional data
    const enrichedListing = {
      ...listing.toObject(),
      inquiries: inquiryCount
    };
    
    res.status(200).json(enrichedListing);
  } catch (error) {
    logger.error('Error fetching broker listing:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid listing ID' });
    }
    
    res.status(500).json({ message: 'Failed to fetch listing details' });
  }
};

/**
 * Toggle listing active status
 */
exports.toggleListingActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const brokerEmail = req.session.user?.email;
    
    if (!brokerEmail) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Validate ID format
    if (!validator.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid listing ID' });
    }
    
    // Ensure the broker owns this listing
    const listing = await Apartment.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    if (listing.brokerEmail !== brokerEmail) {
      return res.status(403).json({ message: 'You do not have permission to modify this listing' });
    }
    
    listing.isActive = Boolean(isActive);
    await listing.save();
    
    logger.info('Listing status updated:', { listingId: id, isActive, brokerEmail });
    res.status(200).json({ message: 'Listing status updated successfully', listing });
  } catch (error) {
    logger.error('Error toggling listing status:', error);
    res.status(500).json({ message: 'Failed to update listing status' });
  }
};

/**
 * Delete a listing
 */
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const brokerEmail = req.session.user?.email;
    
    if (!brokerEmail) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Validate ID format
    if (!validator.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid listing ID' });
    }
    
    // Ensure the broker owns this listing
    const listing = await Apartment.findById(id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    if (listing.brokerEmail !== brokerEmail) {
      return res.status(403).json({ message: 'You do not have permission to delete this listing' });
    }
    
    await Apartment.findByIdAndDelete(id);
    
    // Also delete related inquiries
    await Inquiry.deleteMany({ apartmentId: id });
    
    logger.info('Listing deleted:', { listingId: id, brokerEmail });
    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    logger.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
};

