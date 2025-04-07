
const express = require('express');
const User = require('../models/User');
const Apartment = require('../models/Apartment');
const { auth, isBroker, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up storage for files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Get all brokers (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { role: 'broker' };
    
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter['brokerVerification.status'] = status;
    }
    
    const brokers = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });
      
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
      { 
        $set: { 
          'brokerVerification.status': 'approved',
          'brokerVerification.reviewedBy': req.user.id,
          'brokerVerification.reviewedAt': Date.now()
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // TODO: Send email notification to broker
    
    res.json({ 
      message: 'Broker approved successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reject broker application (admin only)
router.put('/reject/:userId', auth, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        $set: { 
          'brokerVerification.status': 'rejected',
          'brokerVerification.rejectionReason': reason || 'No reason provided',
          'brokerVerification.reviewedBy': req.user.id,
          'brokerVerification.reviewedAt': Date.now()
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // TODO: Send email notification to broker
    
    res.json({ 
      message: 'Broker application rejected',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Revoke broker status (admin only)
router.put('/revoke/:userId', auth, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        $set: { 
          'brokerVerification.status': 'rejected',
          'brokerVerification.rejectionReason': reason || 'Privileges revoked by admin',
          'brokerVerification.reviewedBy': req.user.id,
          'brokerVerification.reviewedAt': Date.now()
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // TODO: Send email notification to broker
    
    res.json({ 
      message: 'Broker privileges revoked',
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
      role: 'broker',
      'brokerVerification.status': 'approved'
    }).select('name email companyName brokerVerification.companyName avatar');
    
    if (!broker) {
      return res.status(404).json({ message: 'Broker not found' });
    }
    
    res.json(broker);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
