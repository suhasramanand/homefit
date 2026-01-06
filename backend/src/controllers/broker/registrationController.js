/**
 * Broker registration controller
 */

const User = require("../../models/User");
const fs = require("fs");
const logger = require("../../utils/logger");
const validator = require("../../utils/validators");
const constants = require("../../utils/constants");

/**
 * Register a broker (public)
 */
exports.registerBroker = async (req, res) => {
  try {
    const { fullName, email, password, phone, licenseNumber } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !password || !phone || !licenseNumber) {
      // Clean up uploaded file if validation fails
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          logger.error('Error cleaning up file:', err);
        }
      }
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "License document is required" });
    }
    
    // Sanitize email
    const sanitizedEmail = validator.sanitizeEmail(email);
    
    logger.debug("Broker registration:", { email: sanitizedEmail, file: req.file.filename });

    // Check for existing user
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      // Clean up uploaded file
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          logger.error('Error cleaning up file:', err);
        }
      }
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Validate inputs
    if (!validator.isValidFullName(fullName)) {
      // Clean up uploaded file
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          logger.error('Error cleaning up file:', err);
        }
      }
      return res.status(400).json({ error: "Invalid full name format" });
    }

    if (!validator.isValidPassword(password)) {
      // Clean up uploaded file
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          logger.error('Error cleaning up file:', err);
        }
      }
      return res.status(400).json({ error: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character" });
    }

    if (phone && !validator.isValidPhone(phone)) {
      // Clean up uploaded file
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (err) {
          logger.error('Error cleaning up file:', err);
        }
      }
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // Create full path for document URL
    const licenseDocumentUrl = `/uploads/${req.file.filename}`;

    // Save user with full license document path
    const newBroker = new User({
      fullName: validator.sanitizeString(fullName),
      email: sanitizedEmail,
      password,
      phone: phone ? validator.sanitizeString(phone) : null,
      licenseNumber: licenseNumber ? validator.sanitizeString(licenseNumber) : null,
      licenseDocumentUrl,
      type: constants.USER_TYPES.BROKER,
      isApproved: false,
    });

    await newBroker.save();
    logger.info("Broker registered successfully:", { email: sanitizedEmail, documentUrl: licenseDocumentUrl });

    res.status(201).json({ message: "Registration successful. Pending admin approval." });
  } catch (error) {
    logger.error("Broker registration error:", error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        logger.error('Error cleaning up file:', err);
      }
    }
    
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
};

