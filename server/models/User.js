
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'broker', 'admin'],
    default: 'user'
  },
  savedApartments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment'
  }],
  preferences: {
    budget: {
      min: Number,
      max: Number
    },
    location: [String],
    bedrooms: Number,
    bathrooms: Number,
    amenities: [String]
  },
  // Added broker verification fields
  brokerVerification: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    licenseNumber: String,
    licenseDocument: String,
    companyName: String,
    businessAddress: String,
    yearsOfExperience: Number,
    specializations: [String],
    submittedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    rejectionReason: String
  },
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
