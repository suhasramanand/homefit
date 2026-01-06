/**
 * Admin-related user controller functions
 */

const User = require("../../models/User");
const fs = require("fs");
const path = require("path");
const logger = require("../../utils/logger");

/**
 * Get all users (admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json({ users });
  } catch (error) {
    logger.error("Error retrieving users:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndDelete({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Delete associated image if exists
    if (user.imagePath) {
      const imagePath = path.join(__dirname, "..", "..", user.imagePath);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (err) {
          logger.warn('Error deleting user image:', err);
        }
      }
    }

    logger.info('User deleted:', { email: req.body.email });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Upload user image (legacy - use uploadProfileImage instead)
 */
exports.uploadImage = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          logger.error('Error cleaning up file:', err);
        }
      }
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          logger.error('Error cleaning up file:', err);
        }
      }
      return res.status(404).json({ error: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (user.imagePath) {
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          logger.error('Error cleaning up file:', err);
        }
      }
      return res.status(400).json({ error: "Image already exists for this user" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    user.imagePath = filePath;
    await user.save();

    logger.info('User image uploaded:', { email, path: filePath });
    res.status(201).json({ message: "Image uploaded successfully", filePath });
  } catch (error) {
    logger.error("Error uploading image:", error);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        logger.error('Error cleaning up file:', err);
      }
    }
    res.status(500).json({ error: "Server error" });
  }
};

