
const express = require('express');
const Apartment = require('../models/Apartment');
const { auth, isBroker } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up storage for images
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

// Get all apartments with optional filters
router.get('/', async (req, res) => {
  try {
    const { 
      minPrice, maxPrice, bedrooms, bathrooms, 
      location, amenities, available 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (bedrooms) {
      filter['features.bedrooms'] = Number(bedrooms);
    }
    
    if (bathrooms) {
      filter['features.bathrooms'] = Number(bathrooms);
    }
    
    if (location) {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }
    
    if (amenities) {
      const amenitiesList = amenities.split(',');
      filter.amenities = { $all: amenitiesList };
    }
    
    if (available !== undefined) {
      filter.available = available === 'true';
    }
    
    const apartments = await Apartment.find(filter)
      .populate('broker', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get apartment by ID
router.get('/:id', async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id)
      .populate('broker', 'name email');
    
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    
    res.json(apartment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new apartment (brokers only)
router.post('/', auth, isBroker, upload.array('images', 10), async (req, res) => {
  try {
    const {
      title, description, price, address, city, state, zipCode,
      lat, lng, bedrooms, bathrooms, squareFeet, yearBuilt,
      amenities, petPolicy, leaseTerms, parkingAvailable, utilities
    } = req.body;
    
    // Process uploaded images
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    
    const apartment = new Apartment({
      title,
      description,
      price: Number(price),
      location: {
        address,
        city,
        state,
        zipCode,
        coordinates: {
          lat: Number(lat),
          lng: Number(lng)
        }
      },
      features: {
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        squareFeet: Number(squareFeet),
        yearBuilt: Number(yearBuilt)
      },
      amenities: amenities.split(','),
      images: imageUrls,
      broker: req.user.id,
      petPolicy,
      leaseTerms: leaseTerms.split(','),
      parkingAvailable: parkingAvailable === 'true',
      utilities: utilities ? utilities.split(',') : []
    });
    
    const savedApartment = await apartment.save();
    res.status(201).json(savedApartment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update apartment (brokers only)
router.put('/:id', auth, isBroker, async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    
    // Check if broker owns this apartment
    if (apartment.broker.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedApartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json(updatedApartment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete apartment (brokers only)
router.delete('/:id', auth, isBroker, async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }
    
    // Check if broker owns this apartment
    if (apartment.broker.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await apartment.remove();
    res.json({ message: 'Apartment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get apartments by broker ID
router.get('/broker/:brokerId', async (req, res) => {
  try {
    const apartments = await Apartment.find({ broker: req.params.brokerId })
      .sort({ createdAt: -1 });
    
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
