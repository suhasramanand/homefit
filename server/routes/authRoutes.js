
const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const router = express.Router();

// Set up storage for license documents
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/licenses/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only PDF, JPG, JPEG, or PNG files are allowed!');
    }
  }
});

// Register regular user
router.post('/register', upload.none(), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'user' // Default to 'user' if no role specified
    });
    
    await user.save();
    
    // Create user session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Register broker with license and verification
router.post('/register/broker', upload.single('licenseDocument'), async (req, res) => {
  try {
    const { 
      name, email, password, licenseNumber, 
      companyName, businessAddress, yearsOfExperience, 
      specializations 
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'License document is required' });
    }
    
    // Create new broker user with verification details
    const user = new User({
      name,
      email,
      password,
      role: 'broker',
      brokerVerification: {
        status: 'pending',
        licenseNumber,
        licenseDocument: `/uploads/licenses/${req.file.filename}`,
        companyName,
        businessAddress,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        specializations: specializations ? specializations.split(',') : [],
        submittedAt: Date.now()
      }
    });
    
    await user.save();
    
    // Create user session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      brokerVerification: {
        status: user.brokerVerification.status
      }
    };
    
    res.status(201).json({
      message: 'Broker registered successfully. Pending admin approval.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        brokerVerification: {
          status: user.brokerVerification.status
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // For brokers, check verification status
    if (user.role === 'broker' && user.brokerVerification && user.brokerVerification.status !== 'approved') {
      return res.status(403).json({
        message: 'Broker account pending approval. Please wait for admin verification.',
        pendingApproval: true
      });
    }
    
    // Update last active timestamp
    user.lastActive = Date.now();
    await user.save();
    
    // Create user session
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role
    };
    
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        brokerVerification: user.role === 'broker' ? {
          status: user.brokerVerification?.status
        } : undefined
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if user is authenticated
router.get('/check', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({
      isAuthenticated: true,
      user: req.session.user
    });
  }
  res.json({
    isAuthenticated: false
  });
});

module.exports = router;
