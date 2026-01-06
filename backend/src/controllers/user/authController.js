/**
 * Authentication-related user controller functions
 */

const User = require("../../models/User");
const logger = require("../../utils/logger");
const constants = require("../../utils/constants");

/**
 * Login user
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Sanitize email - lowercase and trim
    const sanitizedEmail = email.toLowerCase().trim();

    logger.info('Login attempt:', sanitizedEmail);

    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      logger.warn('Login failed: User not found', sanitizedEmail);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if broker is approved
    if (user.type === constants.USER_TYPES.BROKER && !user.isApproved) {
      logger.warn('Login failed: Broker not approved', sanitizedEmail);
      return res.status(403).json({ error: "Your broker account is pending approval" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Login failed: Invalid password', sanitizedEmail);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Save session info (don't store password)
    req.session.user = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      type: user.type,
      isApproved: user.isApproved,
      imagePath: user.imagePath || null
    };

    logger.info('Login successful:', { email: user.email, type: user.type });
    res.status(200).json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: "Server error during login" });
  }
};

/**
 * Logout user
 */
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error('Logout error:', err);
      return res.status(500).json({ error: "Failed to log out" });
    }

    res.clearCookie("connect.sid");
    logger.info('User logged out');
    res.status(200).json({ message: "Logged out successfully" });
  });
};

/**
 * Get current session
 */
exports.getSession = (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({ user: req.session.user });
  } else {
    return res.status(401).json({ error: "Not authenticated" });
  }
};

/**
 * Create new user
 */
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, type } = req.body;

    // Validate input
    if (!fullName || !email || !password || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!Object.values(constants.USER_TYPES).includes(type)) {
      return res.status(400).json({ error: `Invalid user type. Must be one of: ${Object.values(constants.USER_TYPES).join(', ')}` });
    }

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = new User({ 
      fullName: fullName.trim(), 
      email: sanitizedEmail, 
      password, 
      type 
    });
    await newUser.save();

    logger.info('User created:', { email: sanitizedEmail, type });
    res.status(201).json({
      message: "User created successfully",
      user: { fullName: newUser.fullName, email: newUser.email, type: newUser.type },
    });
  } catch (error) {
    logger.error("Create User Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

