// middleware/validateRequest.js
const validator = require('../utils/validators');
const logger = require('../utils/logger');

const validateUserCreation = (req, res, next) => {
    const { fullName, email, password } = req.body;
    const errors = [];
  
  // Sanitize inputs
  const sanitizedFullName = fullName ? validator.sanitizeString(fullName) : '';
  const sanitizedEmail = email ? validator.sanitizeEmail(email) : '';

  // Validate fullName
  if (!sanitizedFullName || !validator.isValidFullName(sanitizedFullName)) {
    errors.push('Full name must contain only alphabetic characters and be at least 2 characters long');
    }
  
    // Validate email format
  if (!sanitizedEmail || !validator.isValidEmail(sanitizedEmail)) {
      errors.push('Valid email address is required');
    }
  
    // Validate password strength
  if (!password || !validator.isValidPassword(password)) {
      errors.push('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character');
    }
  
    if (errors.length > 0) {
    logger.warn('User creation validation failed:', { errors });
    return res.status(400).json({ error: 'Validation failed', details: errors });
    }

  // Sanitize request body before passing to controller
  req.body.fullName = sanitizedFullName;
  req.body.email = sanitizedEmail;
  
    next();
  };
  
  const validateUserUpdate = (req, res, next) => {
    const { fullName, password } = req.body;
    const errors = [];
  
    // Validate fullName if provided
  if (fullName !== undefined && fullName !== null) {
    const sanitizedFullName = validator.sanitizeString(fullName);
    if (!validator.isValidFullName(sanitizedFullName)) {
      errors.push('Full name must contain only alphabetic characters and be at least 2 characters long');
    } else {
      req.body.fullName = sanitizedFullName;
    }
    }
  
    // Validate password if provided
    if (password) {
    if (!validator.isValidPassword(password)) {
        errors.push('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character');
      }
    }
  
    if (errors.length > 0) {
    logger.warn('User update validation failed:', { errors });
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

// Validate login request
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !password) {
    errors.push('Email and password are required');
  } else {
    const sanitizedEmail = validator.sanitizeEmail(email);
    if (!validator.isValidEmail(sanitizedEmail)) {
      errors.push('Valid email address is required');
    } else {
      req.body.email = sanitizedEmail;
    }
  }

  if (errors.length > 0) {
    logger.warn('Login validation failed:', { email: req.body.email });
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

// Validate apartment creation/update
const validateApartment = (req, res, next) => {
  const { price, neighborhood } = req.body;
  const errors = [];

  // Validate price
  if (price === undefined || price === null) {
    errors.push('Price is required');
  } else {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < constants.VALIDATION.MIN_PRICE || priceNum > constants.VALIDATION.MAX_PRICE) {
      errors.push(`Price must be a positive number between ${constants.VALIDATION.MIN_PRICE} and ${constants.VALIDATION.MAX_PRICE}`);
    }
  }

  // Validate neighborhood
  if (!neighborhood || typeof neighborhood !== 'string') {
    errors.push('Neighborhood is required');
  } else {
    const sanitizedNeighborhood = validator.sanitizeString(neighborhood);
    if (sanitizedNeighborhood.length < constants.VALIDATION.MIN_NAME_LENGTH) {
      errors.push(`Neighborhood must be at least ${constants.VALIDATION.MIN_NAME_LENGTH} characters long`);
    } else {
      req.body.neighborhood = sanitizedNeighborhood;
    }
  }

  // Validate imageUrls if provided
  if (req.body.imageUrls && Array.isArray(req.body.imageUrls)) {
    if (req.body.imageUrls.length > constants.FILE_UPLOAD.MAX_IMAGE_COUNT) {
      errors.push(`Maximum ${constants.FILE_UPLOAD.MAX_IMAGE_COUNT} images allowed`);
    }
    req.body.imageUrls = req.body.imageUrls.filter(url => 
      typeof url === 'string' && url.trim().length > 0
    );
  }

  if (errors.length > 0) {
    logger.warn('Apartment validation failed:', { errors });
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
};

// Validate ObjectId parameter
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName] || req.body[paramName];
    
    if (!id) {
      return res.status(400).json({ error: `${paramName} is required` });
    }

    if (!validator.isValidObjectId(id)) {
      logger.warn(`Invalid ${paramName} format:`, id);
      return res.status(400).json({ error: `Invalid ${paramName} format` });
    }
  
    next();
  };
  };
  
  module.exports = {
    validateUserCreation,
  validateUserUpdate,
  validateLogin,
  validateApartment,
  validateObjectId
  };