/**
 * Centralized logging utility
 * Only logs in development mode or when explicitly needed
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  // Info logs - only in development
  info: (...args) => {
    if (isDevelopment) {
      console.log('[INFO]', ...args);
    }
  },

  // Error logs - always log
  error: (...args) => {
    console.error('[ERROR]', ...args);
  },

  // Warning logs - always log
  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },

  // Debug logs - only in development
  debug: (...args) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },

  // Request logs - only in development
  request: (req) => {
    if (isDevelopment) {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        user: req.session?.user?.email || 'anonymous'
      });
    }
  }
};

module.exports = logger;

