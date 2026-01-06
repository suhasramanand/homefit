const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const constants = require('../utils/constants');

// Configure storage specifically for profile images
const profileImageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      logger.info('Created uploads directory for profile images:', uploadDir);
    }
    
    logger.debug('Profile image upload destination:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `profile-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    logger.debug('Generated profile image filename:', filename);
    cb(null, filename);
  }
});

// Set up file filter for profile images
const fileFilter = (req, file, cb) => {
  // Validate mimetype exists
  if (!file || !file.mimetype) {
    logger.warn('Profile image upload missing mimetype');
    return cb(new Error('Invalid file type'), false);
  }
  
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    logger.warn('Rejected profile image file:', file.originalname, file.mimetype);
    cb(new Error('Only image files are allowed for profile images!'), false);
  }
};

// Create the multer instance for profile images
const profileImageUpload = multer({
  storage: profileImageStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: constants.FILE_UPLOAD.MAX_FILE_SIZE
  }
});

module.exports = profileImageUpload;

