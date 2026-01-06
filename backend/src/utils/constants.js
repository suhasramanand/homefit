/**
 * Application constants
 */

module.exports = {
  // User types
  USER_TYPES: {
    ADMIN: 'admin',
    BROKER: 'broker',
    USER: 'user'
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 6,
    MAX_LIMIT: 50,
    MIN_LIMIT: 1
  },

  // File upload limits
  FILE_UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_IMAGE_COUNT: 10,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png']
  },

  // Cache TTL (Time To Live)
  CACHE_TTL: {
    MATCHES: 3600, // 1 hour
    PREFERENCES: 3600 // 1 hour
  },

  // Validation limits
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MIN_NAME_LENGTH: 2,
    MAX_BIO_LENGTH: 500,
    MAX_SAVED_APARTMENTS: 50,
    MAX_PRICE: 999999999,
    MIN_PRICE: 0,
    MAX_RADIUS_KM: 100,
    MIN_RADIUS_KM: 0
  },

  // Coordinates limits
  COORDINATES: {
    MIN_LATITUDE: -90,
    MAX_LATITUDE: 90,
    MIN_LONGITUDE: -180,
    MAX_LONGITUDE: 180
  },

  // Sort options
  SORT_OPTIONS: {
    MATCH_SCORE: 'matchScore',
    PRICE: 'price',
    DATE_ADDED: 'dateAdded'
  },

  // Sort orders
  SORT_ORDER: {
    ASC: 'asc',
    DESC: 'desc'
  },

  // Tour status
  TOUR_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    RESCHEDULED: 'rescheduled',
    CANCELED: 'canceled',
    COMPLETED: 'completed'
  },

  // Inquiry status
  INQUIRY_STATUS: {
    PENDING: 'pending',
    RESPONDED: 'responded',
    CLOSED: 'closed'
  },

  // Response messages
  MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    NOT_AUTHENTICATED: 'Not authenticated',
    NOT_AUTHORIZED: 'Not authorized',
    USER_NOT_FOUND: 'User not found',
    APARTMENT_NOT_FOUND: 'Apartment not found',
    PREFERENCE_NOT_FOUND: 'Preferences not found',
    SERVER_ERROR: 'Server error',
    VALIDATION_FAILED: 'Validation failed'
  }
};

