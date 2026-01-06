/**
 * Main user controller - aggregates all user-related controllers
 * This file acts as a facade, re-exporting functions from modular controllers
 */

// Authentication
const authController = require('./user/authController');
exports.loginUser = authController.loginUser;
exports.logoutUser = authController.logoutUser;
exports.getSession = authController.getSession;
exports.createUser = authController.createUser;

// Profile management
const profileController = require('./user/profileController');
exports.getProfile = profileController.getProfile;
exports.updateUser = profileController.updateUser;
exports.uploadProfileImage = profileController.uploadProfileImage;
exports.changePassword = profileController.changePassword;
exports.updateNotificationSettings = profileController.updateNotificationSettings;
exports.getNotificationSettings = profileController.getNotificationSettings;

// Preferences and matching
const preferencesController = require('./user/preferencesController');
exports.submitPreferences = preferencesController.submitPreferences;
exports.getLatestPreference = preferencesController.getLatestPreference;
exports.getMatches = preferencesController.getMatches;

// Saved apartments
const savedApartmentsController = require('./user/savedApartmentsController');
exports.toggleSaveApartment = savedApartmentsController.toggleSaveApartment;
exports.getSavedApartments = savedApartmentsController.getSavedApartments;

// Inquiries
const inquiryController = require('./user/inquiryController');
exports.contactBroker = inquiryController.contactBroker;

// Admin functions
const adminController = require('./user/adminController');
exports.getAllUsers = adminController.getAllUsers;
exports.deleteUser = adminController.deleteUser;
exports.uploadImage = adminController.uploadImage;

// Export utility functions for use in other modules
const matchUtils = require('./user/matchUtils');
exports.clearMatchesCache = matchUtils.clearMatchesCache;
