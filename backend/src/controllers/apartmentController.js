/**
 * Main apartment controller - aggregates all apartment-related controllers
 * This file acts as a facade, re-exporting functions from modular controllers
 */

// Listing operations
const listingController = require('./apartment/listingController');
exports.createApartment = listingController.createApartment;
exports.getAllApartments = listingController.getAllApartments;
exports.getApartmentById = listingController.getApartmentById;
exports.updateApartment = listingController.updateApartment;
exports.getBrokerApartments = listingController.getBrokerApartments;
exports.getFeaturedApartments = listingController.getFeaturedApartments;

// Search operations
const searchController = require('./apartment/searchController');
exports.getNearbyApartments = searchController.getNearbyApartments;
exports.getMatchesByUserEmail = searchController.getMatchesByUserEmail;

// Image operations
const imageController = require('./apartment/imageController');
exports.uploadImages = imageController.uploadImages;
exports.debugUploads = imageController.debugUploads;

// AI operations
const aiController = require('./apartment/aiController');
exports.generateTitleController = aiController.generateTitleController;
