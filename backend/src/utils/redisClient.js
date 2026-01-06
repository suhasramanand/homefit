// utils/redisClient.js
const redis = require('redis');
const logger = require('./logger');

// Create Redis client with the newer API (Redis v4+)
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  password: process.env.REDIS_PASSWORD || undefined,
  socket: {
    connectTimeout: 2000, // 2 second connection timeout
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        logger.warn('Redis: Max reconnection attempts reached. Continuing without Redis.');
        return false; // Stop trying to reconnect
      }
      return Math.min(retries * 100, 1000); // Exponential backoff, max 1 second
    }
  }
});

// Handle events
redisClient.on('error', (err) => {
  logger.error('Redis Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

redisClient.on('end', () => {
  logger.warn('Redis connection ended');
});

// Connect to Redis with retry logic
(async () => {
  const maxRetries = 5;
  let retries = 0;
  
  const connectWithRetry = async () => {
    try {
      await redisClient.connect();
      logger.info('Successfully connected to Redis');
    } catch (err) {
      retries++;
      if (retries < maxRetries) {
        logger.warn(`Redis connection attempt ${retries} failed, retrying in 2 seconds...`);
        setTimeout(connectWithRetry, 2000);
      } else {
        logger.error('Failed to connect to Redis after multiple attempts. Continuing without Redis.');
        // Don't exit process - app can work without Redis
      }
    }
  };
  
  connectWithRetry();
})();

// Helper methods with error handling - gracefully handle Redis unavailability
// Add timeout wrapper to prevent blocking
const withTimeout = async (promise, timeoutMs = 1000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
    )
  ]).catch(() => null);
};

const getAsync = async (key) => {
  try {
    if (!redisClient.isOpen) {
      return null;
    }
    // Add 1 second timeout to prevent blocking
    return await withTimeout(redisClient.get(key), 1000);
  } catch (err) {
    logger.warn('Redis getAsync error:', err.message);
    return null;
  }
};

const setexAsync = async (key, seconds, value) => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }
    // Add 1 second timeout to prevent blocking
    await withTimeout(redisClient.setEx(key, seconds, value), 1000);
    return true;
  } catch (err) {
    logger.warn('Redis setexAsync error:', err.message);
    return false;
  }
};

const delAsync = async (key) => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }
    return await redisClient.del(key);
  } catch (err) {
    logger.warn('Redis delAsync error:', err.message);
    return false;
  }
};

module.exports = {
  getAsync,
  setexAsync,
  delAsync,
  redisClient,
};