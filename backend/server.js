const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); 
const userRoutes = require('./src/routes/userRoutes');
const apartmentRoutes = require('./src/routes/apartmentRoutes'); 
const brokerRoutes = require('./src/routes/brokerRoutes'); 
const adminRoutes = require('./src/routes/adminRoutes');
const systemRoutes = require('./src/routes/systemRoutes');
const tourRoutes = require('./src/routes/tourRoutes'); 
const systemController = require('./src/controllers/systemController');
const SystemSettings = require('./src/models/SystemSettings');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
require('dotenv').config();
require('./src/utils/redisClient');

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Enable CORS with credentials
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ✅ Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Input sanitization middleware (apply globally)
const sanitizeInput = require('./src/middleware/sanitizeInput');
app.use(sanitizeInput);

// ✅ Session middleware using MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

// ✅ Connect to MongoDB
require('./src/config/db');

// Initialize system settings
(async () => {
  try {
    await systemController.initSystemSettings();
    const logger = require('./src/utils/logger');
    logger.info('System settings initialized successfully');
  } catch (err) {
    const logger = require('./src/utils/logger');
    logger.error('Failed to initialize system settings:', err);
  }
})();

// Add the system routes
app.use('/api/system', systemRoutes);
app.use('/api/admin', adminRoutes); // Admin routes already have their own file

// Add maintenance mode middleware for non-admin routes
app.use(async (req, res, next) => {
  // ALWAYS allow these paths regardless of maintenance mode
  const allowedPaths = [
    '/api/user/login',       // Login API endpoint
    '/api/user/logout',      // Logout API endpoint
    '/api/user/session',     // Session check endpoint
    '/api/system/maintenance-status',  // Maintenance status check
    '/api-docs'              // API documentation
  ];
  
  // If the path is in the allowed list, always proceed
  if (allowedPaths.includes(req.path) || req.path.startsWith('/api-docs')) {
    return next();
  }
  
  // Skip middleware for admin routes
  if (req.path.startsWith('/api/admin')) {
    return next();
  }
  
  try {
    // Get current maintenance status
    const settings = await SystemSettings.findOne({ key: 'maintenanceMode' });
    
    if (settings && settings.value.enabled) {
      // Check if user is an admin
      if (req.session.user && req.session.user.type === 'admin') {
        // Allow admin users to bypass maintenance mode
        return next();
      }
      
      // Block non-admin access during maintenance with JSON response
      return res.status(503).json({
        error: 'Service Unavailable',
        message: settings.value.message || 'Site is under maintenance',
        estimatedTime: settings.value.estimatedTime || null
      });
    }
    
    // Continue if not in maintenance mode
    next();
  } catch (err) {
    const logger = require('./src/utils/logger');
    logger.error('Error checking maintenance mode:', err);
    // Continue in case of errors with the settings check
    next();
  }
});

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

const uploadsDir = path.join(__dirname, 'src/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Backward compatibility: serve old /images/ paths from /uploads/ if file exists there
app.get('/images/:filename', (req, res, next) => {
  const filename = req.params.filename;
  const uploadsPath = path.join(__dirname, 'src/uploads', filename);
  
  // Check if file exists in uploads directory (where files are actually stored)
  // Many old profile images were saved with /images/ path but stored in uploads/
  if (fs.existsSync(uploadsPath)) {
    // File exists in uploads, serve it directly from there
    return res.sendFile(uploadsPath);
  }
  
  // Otherwise, let express.static try the images directory
  next();
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/broker', brokerRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/system', systemRoutes);

// For the /api/admin/set-maintenance-mode endpoint specifically
app.use('/api/admin', systemRoutes);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global error handler - must be last middleware
app.use((err, req, res, next) => {
  const logger = require('./src/utils/logger');
  
  // Log the error
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack }),
    ...(isDevelopment && { details: err })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  const logger = require('./src/utils/logger');
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;