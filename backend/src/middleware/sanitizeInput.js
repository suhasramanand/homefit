/**
 * Input sanitization middleware
 * Sanitizes request body, query, and params to prevent XSS and injection attacks
 */

const validator = require('../utils/validators');

const sanitizeInput = (req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = validator.sanitizeObject(req.body);
  }

  // Sanitize query parameters (strings only)
  if (req.query && typeof req.query === 'object') {
    for (const [key, value] of Object.entries(req.query)) {
      if (typeof value === 'string') {
        req.query[key] = validator.sanitizeString(value);
      }
    }
  }

  // Sanitize params (strings only)
  if (req.params && typeof req.params === 'object') {
    for (const [key, value] of Object.entries(req.params)) {
      if (typeof value === 'string') {
        req.params[key] = validator.sanitizeString(value);
      }
    }
  }

  next();
};

module.exports = sanitizeInput;

