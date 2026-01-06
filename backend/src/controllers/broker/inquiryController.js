/**
 * Broker inquiry management controller
 */

const Inquiry = require("../../models/Inquiry");
const Apartment = require("../../models/Apartment");
const User = require("../../models/User");
const logger = require("../../utils/logger");
const validator = require("../../utils/validators");

/**
 * Get broker's inquiries
 */
exports.getBrokerInquiries = async (req, res) => {
  try {
    const brokerEmail = req.session.user?.email;
    if (!brokerEmail) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get all broker's listings
    const listings = await Apartment.find({ brokerEmail }, '_id');
    const listingIds = listings.map(listing => listing._id);
    
    if (listingIds.length === 0) {
      return res.status(200).json({ inquiries: [] });
    }
    
    // Get inquiries for those listings
    const inquiries = await Inquiry.find({ apartmentId: { $in: listingIds } })
      .sort({ createdAt: -1 });
    
    // Enrich inquiries with apartment titles and user info
    const enrichedInquiries = await Promise.all(
      inquiries.map(async (inquiry) => {
        const apartment = await Apartment.findById(inquiry.apartmentId);
        const user = await User.findOne({ email: inquiry.userEmail });
        
        return {
          ...inquiry.toObject(),
          apartmentTitle: apartment ? `${apartment.bedrooms} BHK in ${apartment.neighborhood}` : 'Unknown Property',
          userName: user ? user.fullName : 'Unknown User',
          userAvatar: user?.imagePath || null
        };
      })
    );
    
    res.status(200).json({ inquiries: enrichedInquiries });
  } catch (error) {
    logger.error('Error fetching broker inquiries:', error);
    res.status(500).json({ message: 'Failed to fetch inquiries' });
  }
};

/**
 * Reply to an inquiry
 */
exports.replyToInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const brokerEmail = req.session.user?.email;
    
    if (!brokerEmail) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // Validate ID format
    if (!validator.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid inquiry ID' });
    }
    
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    // Ensure the broker owns the listing related to this inquiry
    const listing = await Apartment.findById(inquiry.apartmentId);
    if (!listing || listing.brokerEmail !== brokerEmail) {
      return res.status(403).json({ message: 'You do not have permission to reply to this inquiry' });
    }
    
    // Update inquiry
    inquiry.brokerResponse = validator.sanitizeString(message);
    inquiry.status = 'responded';
    inquiry.responseDate = new Date();
    await inquiry.save();
    
    logger.info('Inquiry replied:', { inquiryId: id, brokerEmail });
    res.status(200).json({ message: 'Reply sent successfully', inquiry });
  } catch (error) {
    logger.error('Error replying to inquiry:', error);
    res.status(500).json({ message: 'Failed to send reply' });
  }
};

