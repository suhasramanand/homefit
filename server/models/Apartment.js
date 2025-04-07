
const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  features: {
    bedrooms: Number,
    bathrooms: Number,
    squareFeet: Number,
    yearBuilt: Number
  },
  amenities: [String],
  images: [String],
  available: {
    type: Boolean,
    default: true
  },
  broker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  petPolicy: String,
  leaseTerms: [String],
  parkingAvailable: Boolean,
  utilities: [String]
});

// Update the 'updatedAt' field on save
apartmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;
