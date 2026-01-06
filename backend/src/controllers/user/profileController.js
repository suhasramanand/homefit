/**
 * User profile-related controller functions
 */

const User = require("../../models/User");
const fs = require("fs");
const path = require("path");
const logger = require("../../utils/logger");
const constants = require("../../utils/constants");
const validator = require("../../utils/validators");

/**
 * Get user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const email = req.session.user?.email;
    if (!email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ email }, { password: 0 });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update user profile
 */
exports.updateUser = async (req, res) => {
  try {
    const email = req.session.user?.email;
    if (!email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate and update fields (fullName already validated by middleware)
    if (req.body.fullName) {
      user.fullName = req.body.fullName; // Already sanitized
    }
    
    if (req.body.bio !== undefined) {
      // Sanitize bio - trim and limit length
      user.bio = req.body.bio ? validator.sanitizeString(req.body.bio).substring(0, constants.VALIDATION.MAX_BIO_LENGTH) : null;
    }
    
    if (req.body.password) {
      // Password already validated by validateUserUpdate middleware
      if (req.body.password.length < constants.VALIDATION.MIN_PASSWORD_LENGTH) {
        return res.status(400).json({ error: `Password must be at least ${constants.VALIDATION.MIN_PASSWORD_LENGTH} characters` });
      }
      user.password = req.body.password; // Will be hashed by pre-save hook
    }

    await user.save();

    // Update session (don't include password)
    req.session.user = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      type: user.type,
      isApproved: user.isApproved,
      imagePath: user.imagePath
    };

    // Prepare response (sanitize sensitive fields)
    const updatedUser = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      imagePath: user.imagePath,
      type: user.type
    };

    logger.info('User updated:', { email: user.email });
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    logger.error("Error updating user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Upload profile image
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    const email = req.session.user?.email;
    if (!email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Validate filename has correct prefix
    if (!req.file.filename.startsWith('profile-')) {
      logger.warn('Profile image uploaded with incorrect prefix:', req.file.filename);
      // Clean up the incorrectly named file
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        logger.error('Error deleting incorrectly named file:', err);
      }
      return res.status(400).json({ error: "Invalid file format" });
    }
    
    logger.debug('Profile image upload:', { 
      filename: req.file.filename, 
      email: user.email,
      size: req.file.size 
    });
    
    // Delete old image if exists
    if (user.imagePath) {
      try {
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
          fs.unlinkSync(oldImagePath);
          logger.debug('Deleted old profile image:', oldImagePath);
        }
      } catch (err) {
        logger.warn('Error deleting old image:', err);
        // Continue with upload even if delete fails
      }
    }

    const filePath = `/uploads/${req.file.filename}`;
    user.imagePath = filePath;
    await user.save();

    // Update session
    if (req.session.user) {
      req.session.user.imagePath = filePath;
    }

    logger.info('Profile image updated successfully:', { email: user.email, path: filePath });

    res.status(200).json({ 
      message: "Profile image updated successfully", 
      imagePath: filePath 
    });
  } catch (error) {
    logger.error('Error uploading profile image:', error);
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (err) {
        logger.error('Error deleting uploaded file after error:', err);
      }
    }
    
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const email = req.session.user?.email;
    
    if (!email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    if (newPassword.length < constants.VALIDATION.MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ error: `New password must be at least ${constants.VALIDATION.MIN_PASSWORD_LENGTH} characters` });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update with new password
    user.password = newPassword;
    await user.save();
    
    logger.info('Password changed:', { email });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    logger.error("Error changing password:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Update notification settings
 */
exports.updateNotificationSettings = async (req, res) => {
  try {
    const email = req.session.user?.email;
    if (!email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate notification settings
    const validSettings = ['emailNotifications', 'newInquiryAlerts', 'marketingUpdates', 'accountAlerts'];
    const updates = {};
    
    validSettings.forEach(setting => {
      if (req.body[setting] !== undefined) {
        updates[setting] = Boolean(req.body[setting]);
      }
    });

    // Update notification settings
    user.notificationSettings = {
      ...user.notificationSettings,
      ...updates
    };

    await user.save();
    logger.info('Notification settings updated:', { email });
    res.status(200).json({ 
      message: "Notification settings updated successfully",
      notificationSettings: user.notificationSettings
    });
  } catch (error) {
    logger.error("Error updating notification settings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get notification settings
 */
exports.getNotificationSettings = async (req, res) => {
  try {
    const email = req.session.user?.email;
    if (!email) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ 
      notificationSettings: user.notificationSettings || {
        emailNotifications: true,
        newInquiryAlerts: true,
        marketingUpdates: false,
        accountAlerts: true
      }
    });
  } catch (error) {
    logger.error("Error fetching notification settings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

