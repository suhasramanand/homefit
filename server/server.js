
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Redis = require('ioredis');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const userRoutes = require('./routes/userRoutes');
const brokerRoutes = require('./routes/brokerRoutes');
const aiRoutes = require('./routes/aiRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Redis client
let redisClient = null;
if (process.env.REDIS_URI) {
  try {
    redisClient = new Redis(process.env.REDIS_URI);
    console.log('Connected to Redis');
    
    // Test Redis connection
    redisClient.ping().then(() => {
      console.log('Redis connection successful');
    });
    
    // Handle Redis errors
    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
}

// Configure middleware to make Redis client available to routes
app.use((req, res, next) => {
  req.redisClient = redisClient;
  next();
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true // Allow cookies with CORS
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directories if they don't exist
const fs = require('fs');
const dirs = ['uploads', 'uploads/profiles', 'uploads/licenses'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/brokers', brokerRoutes);
app.use('/api/ai', aiRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('AptMatchBuddy API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
