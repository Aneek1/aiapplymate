const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'USA' },
  },
  linkedinUrl: String,
  portfolioUrl: String,
  headline: String,
  summary: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    startDate: Date,
    endDate: Date,
  },
  stats: {
    totalApplications: { type: Number, default: 0 },
    interviews: { type: Number, default: 0 },
    offers: { type: Number, default: 0 },
    rejections: { type: Number, default: 0 },
  },
  lastLoginAt: Date,
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
