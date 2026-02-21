const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const resumesRoutes = require('./routes/resumes');
const preferencesRoutes = require('./routes/preferences');
const applicationsRoutes = require('./routes/applications');
const autoApplyRoutes = require('./routes/auto-apply.routes');
const geminiRoutes = require('./routes/gemini.routes');

// IMPORTANT: Body parser MUST come BEFORE routes!
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test user middleware
app.use((req, res, next) => {
  req.user = { id: 'test-user-123', email: 'test@example.com' };
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(() => console.log('⚠️ Running without MongoDB'));

// Routes - These must come AFTER body parser!
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/resumes', resumesRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/auto-apply', autoApplyRoutes);
app.use('/api/gemini', geminiRoutes);
app.use("/api/resumes", resumesRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    user: req.user,
    routes: ['auth', 'users', 'resumes', 'preferences', 'applications', 'auto-apply', 'gemini']
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Routes: auth, users, resumes, preferences, applications, auto-apply, gemini`);
});

module.exports = app;
