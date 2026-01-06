const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const constants = require('../utils/constants');

// Configure storage for apartment images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      logger.info('Created uploads directory:', uploadDir);
    }
    
    logger.debug('Upload destination:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `apt-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    logger.debug('Generated filename:', filename);
    cb(null, filename);
  }
});

// Set up file filter for images
const fileFilter = (req, file, cb) => {
  // Validate mimetype exists and is an image
  if (!file || !file.mimetype) {
    logger.warn('File upload missing mimetype');
    return cb(new Error('Invalid file type'), false);
  }
  
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    logger.warn('Rejected file:', file.originalname, file.mimetype);
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create the multer instance with limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: constants.FILE_UPLOAD.MAX_FILE_SIZE
  }
});

// Error handling middleware for upload errors
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.error('Multer error:', err.message, err.code);
    
    // Handle specific multer error codes
    let statusCode = 400;
    let message = err.message;
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxSizeMB = constants.FILE_UPLOAD.MAX_FILE_SIZE / (1024 * 1024);
      message = `File size exceeds the maximum limit of ${maxSizeMB}MB`;
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    }
    
    return res.status(statusCode).json({ 
      error: message,
      code: err.code
    });
  } else if (err) {
    logger.error('Upload error:', err.message);
    return res.status(400).json({ 
      error: err.message || 'Upload failed'
    });
  }
  
  next();
};

module.exports = upload;
module.exports.handleUploadErrors = handleUploadErrors;