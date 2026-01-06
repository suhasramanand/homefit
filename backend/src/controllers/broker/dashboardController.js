/**
 * Broker dashboard and statistics controller
 */

const Apartment = require("../../models/Apartment");
const Inquiry = require("../../models/Inquiry");
const logger = require("../../utils/logger");

/**
 * Get broker dashboard stats
 */
exports.getBrokerStats = async (req, res) => {
  try {
    const brokerEmail = req.session.user?.email;
    if (!brokerEmail) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const totalListings = await Apartment.countDocuments({ brokerEmail });
    const activeListings = await Apartment.countDocuments({ brokerEmail, isActive: true });
    
    // Count inquiries
    const inquiries = await Inquiry.find({ brokerEmail });
    const newInquiries = inquiries.filter(inq => inq.status === 'pending').length;
    
    // Count pending approvals (if your app has an approval workflow)
    const pendingApprovals = await Apartment.countDocuments({ 
      brokerEmail, 
      approvalStatus: 'pending' 
    });

    res.status(200).json({
      totalListings,
      activeListings,
      newInquiries,
      pendingApprovals: pendingApprovals || 0,
    });
  } catch (error) {
    logger.error('Error fetching broker stats:', error);
    res.status(500).json({ message: 'Failed to fetch broker stats' });
  }
};

/**
 * Get listing performance metrics
 */
exports.getListingPerformance = async (req, res) => {
  try {
    const brokerEmail = req.session.user?.email;
    if (!brokerEmail) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get broker's listings
    const listings = await Apartment.find({ brokerEmail }, '_id bedrooms neighborhood');
    
    // Calculate metrics for each listing
    const performance = await Promise.all(
      listings.map(async (listing) => {
        const inquiryCount = await Inquiry.countDocuments({ apartmentId: listing._id });
        
        return {
          _id: listing._id,
          title: `${listing.bedrooms} BHK in ${listing.neighborhood}`,
          inquiries: inquiryCount
        };
      })
    );
    
    // Sort by inquiries (highest first)
    performance.sort((a, b) => b.inquiries - a.inquiries);
    
    res.status(200).json({ listings: performance });
  } catch (error) {
    logger.error('Error fetching listing performance:', error);
    res.status(500).json({ message: 'Failed to fetch performance metrics' });
  }
};

