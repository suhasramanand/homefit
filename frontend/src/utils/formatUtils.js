/**
 * Formatting Utility Functions
 * Common formatting functions used across the application
 */

/**
 * Formats a price/number to currency format
 * @param {number|string} price - Price to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {object} options - Additional formatting options
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'USD', options = {}) => {
  if (price === null || price === undefined || price === '') {
    return 'N/A';
  }

  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return 'N/A';
  }

  const defaultOptions = {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
    ...options,
  };

  return new Intl.NumberFormat('en-US', defaultOptions).format(numPrice);
};

/**
 * Formats a price with simple comma separation (for display)
 * @param {number|string} price - Price to format
 * @returns {string} Formatted price string (e.g., "$1,234")
 */
export const formatPriceSimple = (price) => {
  if (price === null || price === undefined || price === '') {
    return 'N/A';
  }

  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return 'N/A';
  }

  return `$${numPrice.toLocaleString()}`;
};

/**
 * Formats a date using dayjs
 * @param {string|Date|dayjs.Dayjs} date - Date to format
 * @param {string} format - Format string (default: 'MMM D, YYYY')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'MMM D, YYYY') => {
  if (!date) return '';
  
  const dayjs = require('dayjs');
  return dayjs(date).format(format);
};

/**
 * Formats a date for input fields (YYYY-MM-DD)
 * @param {string|Date|dayjs.Dayjs} date - Date to format
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dayjs = require('dayjs');
  if (date.format) {
    return date.format('YYYY-MM-DD');
  }
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * Gets match color based on score
 * @param {number} score - Match score (0-100)
 * @returns {string} Color hex code
 */
export const getMatchColor = (score) => {
  if (score >= 80) return "#36B37E";
  if (score >= 50) return "#FFAB00";
  return "#FF5630";
};

/**
 * Formats a phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if not 10 digits
};

/**
 * Truncates text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + suffix;
};

export default {
  formatPrice,
  formatPriceSimple,
  formatDate,
  formatDateForInput,
  getMatchColor,
  formatPhone,
  truncateText,
};

