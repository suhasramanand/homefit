/**
 * Validation Utility Functions
 * Common validation functions used across the application
 */

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates a password
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default: 8)
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password, minLength = 8) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < minLength) {
    return { 
      isValid: false, 
      message: `Password must be at least ${minLength} characters` 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validates a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's 10 digits (US format)
  return cleaned.length === 10;
};

/**
 * Validates that two passwords match
 * @param {string} password - First password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} Validation result with isValid and message
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!password || !confirmPassword) {
    return { isValid: false, message: 'Both passwords are required' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validates a required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field (for error message)
 * @returns {object} Validation result with isValid and message
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validates a number is within a range
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {object} Validation result with isValid and message
 */
export const validateNumberRange = (value, min, max) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { isValid: false, message: 'Must be a valid number' };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, message: `Must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, message: `Must be at most ${max}` };
  }

  return { isValid: true, message: '' };
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validatePasswordMatch,
  validateRequired,
  validateNumberRange,
};

