//routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const { validateUserCreation, validateUserUpdate, validateLogin, validateObjectId } = require('../middleware/validateRequest');
const upload = require('../middleware/uploadMiddleware');
const profileImageUpload = require('../middleware/profileImageUpload');
const { submitPreferences, getMatches } = require('../controllers/userController');

// 🔐 Session-based auth middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Session not found' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.user?.type === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admins only' });
  }
};

const isBroker = (req, res, next) => {
  if (req.session.user?.type === 'broker') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Brokers only' });
  }
};

const isUser = (req, res, next) => {
  if (req.session.user?.type === 'user') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Users only' });
  }
};

// Error handling middleware for multer uploads (must be defined before routes)
const handleMulterError = (err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      const logger = require('../utils/logger');
      logger.error("Multer error:", err.message, err.code);
      return res.status(400).json({ 
        error: `Upload error: ${err.message}`,
        code: err.code
      });
    } else {
      // File filter errors or other upload errors
      logger.error("Upload error:", err.message);
      return res.status(400).json({ 
        error: err.message || "Upload failed"
      });
    }
  }
  next();
};

// ✅ Auth routes
router.post('/login', validateLogin, userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/session', userController.getSession);
router.post('/create', validateUserCreation, userController.createUser);

// ✅ Admin-only route
router.get('/users', isAuthenticated, isAdmin, userController.getAllUsers);

// Profile routes
router.get('/profile', isAuthenticated, userController.getProfile);
// Get notification settings
router.get('/notification-settings', isAuthenticated, userController.getNotificationSettings);
router.put('/notification-settings', isAuthenticated, userController.updateNotificationSettings);
router.put('/change-password', isAuthenticated, userController.changePassword);
router.post('/upload-profile-image', 
  isAuthenticated, 
  profileImageUpload.single('profileImage'),
  (err, req, res, next) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  },
  userController.uploadProfileImage
);

// ✅ Protected user routes
router.put('/edit', isAuthenticated, validateUserUpdate, userController.updateUser);
router.delete('/delete', isAuthenticated, userController.deleteUser);
router.get('/getAll', isAuthenticated, userController.getAllUsers);
router.post('/uploadImage', isAuthenticated, upload.single('image'), userController.uploadImage);
router.post('/save', isAuthenticated, isUser, userController.toggleSaveApartment);
router.get('/saved', isAuthenticated, isUser, userController.getSavedApartments);
router.post('/contact-broker', isAuthenticated, isUser, userController.contactBroker);



// ✅ User Preferences and Matching
router.post('/preferences', isAuthenticated, isUser, submitPreferences);
router.get('/preferences/latest', isAuthenticated, isUser, userController.getLatestPreference);
router.get('/matches/:prefId', isAuthenticated, isUser, validateObjectId('prefId'), getMatches);

// ✅ MBTA API Proxy (for bus stops)
const mbtaController = require('../controllers/user/mbtaController');
router.get('/mbta/stops', isAuthenticated, mbtaController.getNearbyBusStops);
router.get('/mbta/routes/:stopId', isAuthenticated, mbtaController.getStopRoutes);

module.exports = router;
