
const express = require('express');
const User = require('../models/User');
const Apartment = require('../models/Apartment');
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Set up storage for profile images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
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

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile with avatar upload
router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If avatar file is uploaded
    if (req.file) {
      updateData.avatar = `/uploads/profiles/${req.file.filename}`;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's favorites
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const favorites = await Apartment.find({
      _id: { $in: user.savedApartments }
    }).populate('broker', 'name email');
    
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add apartment to favorites
router.post('/favorites/:apartmentId', auth, async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.apartmentId);
    
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    
    // Check if already in favorites
    const user = await User.findById(req.user.id);
    
    if (user.savedApartments.includes(req.params.apartmentId)) {
      return res.status(400).json({ message: 'Apartment already in favorites' });
    }
    
    // Add to favorites
    user.savedApartments.push(req.params.apartmentId);
    await user.save();
    
    res.json({
      message: 'Apartment added to favorites',
      favorites: user.savedApartments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove apartment from favorites
router.delete('/favorites/:apartmentId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.savedApartments.includes(req.params.apartmentId)) {
      return res.status(400).json({ message: 'Apartment not in favorites' });
    }
    
    // Remove from favorites
    user.savedApartments = user.savedApartments.filter(
      id => id.toString() !== req.params.apartmentId
    );
    
    await user.save();
    
    res.json({
      message: 'Apartment removed from favorites',
      favorites: user.savedApartments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { preferences: req.body } },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
