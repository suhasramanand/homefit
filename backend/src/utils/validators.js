/**
 * Input validation and sanitization utilities
 */

const validator = {
  /**
   * Sanitize string input - trim whitespace
   */
  sanitizeString: (str) => {
    if (typeof str !== 'string') return '';
    return str.trim();
  },

  /**
   * Sanitize email - lowercase and trim
   */
  sanitizeEmail: (email) => {
    if (typeof email !== 'string') return '';
    return email.toLowerCase().trim();
  },

  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  /**
   * Validate password strength
   */
  isValidPassword: (password) => {
    if (!password || typeof password !== 'string') return false;
    // At least 8 characters, one uppercase, one lowercase, one digit, one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  /**
   * Validate full name (alphabetic characters and spaces only)
   */
  isValidFullName: (name) => {
    if (!name || typeof name !== 'string') return false;
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name.trim()) && name.trim().length >= 2;
  },

  /**
   * Validate MongoDB ObjectId format
   */
  isValidObjectId: (id) => {
    if (!id || typeof id !== 'string') return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  /**
   * Validate phone number (basic validation)
   */
  isValidPhone: (phone) => {
    if (!phone || typeof phone !== 'string') return false;
    // Allow digits, spaces, hyphens, parentheses, plus sign
    const phoneRegex = /^[\d\s\-+()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  /**
   * Validate URL format
   */
  isValidUrl: (url) => {
    if (!url || typeof url !== 'string') return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate coordinates (latitude, longitude)
   */
  isValidCoordinates: (lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) return false;
    if (latitude < -90 || latitude > 90) return false;
    if (longitude < -180 || longitude > 180) return false;
    
    return true;
  },

  /**
   * Validate numeric range
   */
  isInRange: (value, min, max) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
  },

  /**
   * Sanitize HTML input (basic XSS prevention)
   */
  sanitizeHtml: (html) => {
    if (typeof html !== 'string') return '';
    return html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Validate price range
   */
  isValidPriceRange: (minPrice, maxPrice) => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    
    if (minPrice !== null && minPrice !== undefined && (isNaN(min) || min < 0)) return false;
    if (maxPrice !== null && maxPrice !== undefined && (isNaN(max) || max < 0)) return false;
    if (minPrice !== null && maxPrice !== null && min > max) return false;
    
    return true;
  },

  /**
   * Validate date format (YYYY-MM-DD)
   */
  isValidDate: (dateString) => {
    if (!dateString || typeof dateString !== 'string') return false;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },

  /**
   * Validate time format (HH:MM)
   */
  isValidTime: (timeString) => {
    if (!timeString || typeof timeString !== 'string') return false;
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  },

  /**
   * Sanitize object - remove undefined values and sanitize strings
   */
  sanitizeObject: (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string') {
          sanitized[key] = validator.sanitizeString(value);
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          sanitized[key] = validator.sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
    }
    return sanitized;
  }
};

module.exports = validator;

