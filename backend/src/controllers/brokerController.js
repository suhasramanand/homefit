/**
 * Main broker controller - aggregates all broker-related controllers
 * This file acts as a facade, re-exporting functions from modular controllers
 */

// Registration
const registrationController = require('./broker/registrationController');
exports.registerBroker = registrationController.registerBroker;

// Dashboard
const dashboardController = require('./broker/dashboardController');
exports.getBrokerStats = dashboardController.getBrokerStats;
exports.getListingPerformance = dashboardController.getListingPerformance;

// Listings
const listingsController = require('./broker/listingsController');
exports.getBrokerListings = listingsController.getBrokerListings;
exports.getBrokerListingById = listingsController.getBrokerListingById;
exports.toggleListingActive = listingsController.toggleListingActive;
exports.deleteListing = listingsController.deleteListing;

// Inquiries
const inquiryController = require('./broker/inquiryController');
exports.getBrokerInquiries = inquiryController.getBrokerInquiries;
exports.replyToInquiry = inquiryController.replyToInquiry;

// Profile
const profileController = require('./broker/profileController');
exports.updateBrokerProfile = profileController.updateBrokerProfile;
exports.changePassword = profileController.changePassword;
exports.updateNotificationSettings = profileController.updateNotificationSettings;
exports.getNotificationSettings = profileController.getNotificationSettings;
