
const express = require('express');
const User = require('../models/User');
const Apartment = require('../models/Apartment');
const { auth } = require('../middleware/auth');
const router = express.Router();

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

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, preferences } = req.body;
    
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (preferences) updateFields.preferences = preferences;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save apartment to favorites
router.post('/favorites/:apartmentId', auth, async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.apartmentId);
    
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if apartment is already saved
    if (user.savedApartments.includes(req.params.apartmentId)) {
      return res.status(400).json({ message: 'Apartment already in favorites' });
    }
    
    // Add apartment to saved list
    user.savedApartments.push(req.params.apartmentId);
    await user.save();
    
    res.json({ message: 'Apartment added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove apartment from favorites
router.delete('/favorites/:apartmentId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Filter out the apartment ID
    user.savedApartments = user.savedApartments.filter(
      id => id.toString() !== req.params.apartmentId
    );
    
    await user.save();
    
    res.json({ message: 'Apartment removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's saved apartments
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const savedApartments = await Apartment.find({ 
      _id: { $in: user.savedApartments } 
    }).populate('broker', 'name email');
    
    res.json(savedApartments);
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
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('preferences');
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
