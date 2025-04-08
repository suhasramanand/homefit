
const express = require('express');
const bcrypt = require('bcrypt'); // Using bcrypt instead of bcryptjs to match package.json
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role === 'broker' ? 'broker' : 'user', // Only allow broker or user roles during registration
      brokerVerification: role === 'broker' ? {
        status: 'pending',
        companyName: req.body.companyName,
        licenseNumber: req.body.licenseNumber,
        yearsOfExperience: req.body.yearsOfExperience,
        specializations: req.body.specializations,
        submittedAt: Date.now()
      } : undefined
    });
    
    // Save user to database
    await user.save();
    
    // Create session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      brokerVerification: user.brokerVerification
    };
    
    // Return user data without password
    const userToReturn = { ...user.toObject() };
    delete userToReturn.password;
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: userToReturn
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check if trying to log in as specific role
    if (role && user.role !== role) {
      return res.status(403).json({ message: `You are not registered as a ${role}` });
    }
    
    // Check if broker is approved
    if (user.role === 'broker' && user.brokerVerification?.status !== 'approved') {
      // We'll still log them in but notify them of pending status
      if (user.brokerVerification?.status === 'pending') {
        return res.status(403).json({ 
          message: 'Broker account pending approval. Please wait for admin verification.',
          pendingApproval: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            brokerVerification: user.brokerVerification
          }
        });
      } else if (user.brokerVerification?.status === 'rejected') {
        return res.status(403).json({ 
          message: `Broker application rejected: ${user.brokerVerification?.rejectionReason || 'No reason provided'}`,
          rejected: true
        });
      }
    }
    
    // Update last login time
    user.lastLogin = Date.now();
    await user.save();
    
    // Create session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      brokerVerification: user.brokerVerification
    };
    
    // Return user data without password
    const userToReturn = { ...user.toObject() };
    delete userToReturn.password;
    
    res.json({ 
      message: 'Login successful',
      user: userToReturn
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Check if user is authenticated
router.get('/check', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ 
      isAuthenticated: true, 
      user: req.session.user
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Update password
router.post('/update-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword; // Password will be hashed by pre-save hook
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Setup default admin account
router.get('/setup-admin', async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      return res.json({ 
        message: 'Admin account already exists',
        exists: true
      });
    }
    
    // Generate random password
    const password = crypto.randomBytes(4).toString('hex');
    
    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@aptmatchbuddy.com',
      password,
      role: 'admin'
    });
    
    await admin.save();
    
    res.status(201).json({ 
      message: 'Default admin account created',
      credentials: {
        email: admin.email,
        password
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
