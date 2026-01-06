/**
 * Broker profile management controller
 */

const User = require("../../models/User");
const fs = require("fs");
const path = require("path");
const logger = require("../../utils/logger");
const constants = require("../../utils/constants");
const validator = require("../../utils/validators");

/**
 * Update broker profile with image upload support
 */
exports.updateBrokerProfile = async (req, res) => {
  try {
    const updates = req.body;
    const userId = req.user._id;
    
    // Prevent unauthorized changes
    const restrictedFields = ["type", "email", "isApproved", "_id", "password", "licenseNumber", "licenseDocumentUrl"];
    restrictedFields.forEach((field) => delete updates[field]);
    
    const updateObj = { ...updates };
    
    // Handle profile image if present
    if (req.file) {
      // Save file path
      updateObj.imagePath = `/uploads/${req.file.filename}`;

      // Clean up old profile image if it exists
      const user = await User.findById(userId);
      if (user && user.imagePath) {
        let oldImagePath;
        if (user.imagePath.startsWith('/images/')) {
          const filename = path.basename(user.imagePath);
          oldImagePath = path.join(__dirname, "..", "..", "uploads", filename);
        } else if (user.imagePath.startsWith('/uploads/')) {
          oldImagePath = path.join(__dirname, "..", "..", user.imagePath);
        } else {
          oldImagePath = path.join(__dirname, "..", "..", user.imagePath);
        }
        
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            logger.warn('Error deleting old image:', err);
          }
        }
      }
    }

    // Sanitize string fields
    if (updateObj.fullName) {
      updateObj.fullName = validator.sanitizeString(updateObj.fullName);
    }
    if (updateObj.bio) {
      updateObj.bio = validator.sanitizeString(updateObj.bio).substring(0, constants.VALIDATION.MAX_BIO_LENGTH);
    }
    if (updateObj.phone) {
      updateObj.phone = validator.sanitizeString(updateObj.phone);
    }
    if (updateObj.companyName) {
      updateObj.companyName = validator.sanitizeString(updateObj.companyName);
    }

    const updatedBroker = await User.findByIdAndUpdate(
      userId,
      { $set: updateObj },
      { new: true, runValidators: true }
    ).select('-password');
    
    logger.info('Broker profile updated:', { userId: userId.toString() });
    res.json({ message: "Profile updated successfully", broker: updatedBroker });
  } catch (error) {
    logger.error("Profile update error:", error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        logger.error('Error cleaning up file:', err);
      }
    }
    
    res.status(500).json({ message: "Profile update failed" });
  }
};

/**
 * Change broker password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Validate new password
    if (!validator.isValidPassword(newPassword)) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character' });
    }
    
    // Update with new password
    user.password = newPassword;
    await user.save();
    
    logger.info('Password updated:', { userId: userId.toString() });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    logger.error('Password change error:', error);
    res.status(500).json({ message: 'Failed to update password' });
  }
};

/**
 * Update notification settings
 */
exports.updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Validate notification settings
    const validSettings = ['emailNotifications', 'newInquiryAlerts', 'marketingUpdates', 'accountAlerts'];
    const updates = {};
    
    validSettings.forEach(setting => {
      if (req.body[setting] !== undefined) {
        updates[setting] = Boolean(req.body[setting]);
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { notificationSettings: updates } },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    logger.info('Notification settings updated:', { userId: userId.toString() });
    res.status(200).json({ message: 'Notification settings updated successfully' });
  } catch (error) {
    logger.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Failed to update notification settings' });
  }
};

/**
 * Get notification settings
 */
exports.getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // If no settings exist yet, return defaults
    const defaultSettings = {
      emailNotifications: true,
      newInquiryAlerts: true,
      marketingUpdates: false,
      accountAlerts: true
    };
    
    const notificationSettings = user.notificationSettings || defaultSettings;
    
    res.status(200).json({ notificationSettings });
  } catch (error) {
    logger.error('Error fetching notification settings:', error);
    res.status(500).json({ message: 'Failed to fetch notification settings' });
  }
};

