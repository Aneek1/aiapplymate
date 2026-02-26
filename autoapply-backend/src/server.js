const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// CORS - Allow frontend to connect
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/autoapply');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    console.log('Please make sure MongoDB is running on your machine');
    console.log('Install MongoDB: https://www.mongodb.com/docs/manual/installation/');
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/autoapply', require('./routes/autoapply'));
app.use('/api/gemini', require('./routes/gemini.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AutoApply API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});

module.exports = app;
