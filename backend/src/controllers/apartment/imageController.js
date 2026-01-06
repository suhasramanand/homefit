/**
 * Apartment image upload and management
 */

const path = require("path");
const fs = require("fs");
const logger = require("../../utils/logger");
const constants = require("../../utils/constants");

/**
 * Upload images for apartment
 */
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    // Validate file count
    if (req.files.length > constants.FILE_UPLOAD.MAX_IMAGE_COUNT) {
      // Clean up uploaded files
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          logger.error('Error cleaning up file:', err);
        }
      });
      return res.status(400).json({ message: `Maximum ${constants.FILE_UPLOAD.MAX_IMAGE_COUNT} images allowed` });
    }
    
    logger.debug("Upload Images Request:", { fileCount: req.files.length });
    
    // Create URLs that can be properly accessed by the frontend
    const fileUrls = req.files.map(file => {
      if (!file.filename || !file.filename.startsWith('apt-')) {
        logger.warn('Invalid filename format:', file.filename);
      }
      return `/uploads/${file.filename}`;
    });
    
    logger.info("Images uploaded successfully:", { count: fileUrls.length });
    res.status(200).json({ 
      message: "Images uploaded successfully",
      imageUrls: fileUrls,
      count: fileUrls.length
    });
  } catch (error) {
    logger.error('Image upload error:', error);
    
    // Clean up uploaded files on error
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          logger.error('Error cleaning up file:', err);
        }
      });
    }
    
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

/**
 * Debug uploads directory (development only)
 */
exports.debugUploads = (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, "..", "..", "uploads");
    const files = fs.readdirSync(uploadsDir);
    res.json({ 
      directory: uploadsDir,
      fileCount: files.length,
      files: files.slice(0, 20) // Limit to first 20 files
    });
  } catch (error) {
    logger.error("Debug uploads error:", error);
    res.status(500).json({ message: "Error reading uploads directory" });
  }
};

