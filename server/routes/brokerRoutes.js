
const express = require('express');
const User = require('../models/User');
const Apartment = require('../models/Apartment');
const { auth, isBroker, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all brokers (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const brokers = await User.find({ role: 'broker' }).select('-password');
    res.json(brokers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve broker application (admin only)
router.put('/approve/:userId', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { role: 'broker' } },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      message: 'User approved as broker',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get broker's listings
router.get('/listings', auth, isBroker, async (req, res) => {
  try {
    const apartments = await Apartment.find({ broker: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get broker profile by ID
router.get('/:id', async (req, res) => {
  try {
    const broker = await User.findOne({ 
      _id: req.params.id, 
      role: 'broker' 
    }).select('name email');
    
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    
    res.json(broker);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Apply to become a broker
router.post('/apply', auth, async (req, res) => {
  try {
    // Additional broker application info could be added here
    const { businessName, licenseNumber, experience } = req.body;
    
    // For now, we'll just flag the user for admin approval
    res.json({ 
      message: 'Application submitted for admin approval',
      // In a real implementation, you might save this data to a pending applications collection
      applicationData: {
        userId: req.user.id,
        businessName,
        licenseNumber,
        experience,
        submittedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
