const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  phone: String,
});

const interviewSchema = new mongoose.Schema({
  round: Number,
  type: {
    type: String,
    enum: ['phone', 'video', 'onsite', 'technical', 'behavioral', 'final'],
  },
  scheduledAt: Date,
  completedAt: Date,
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled',
  },
  notes: String,
  feedback: String,
});

const noteSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  // Job Details
  company: {
    name: { type: String, required: true },
    website: String,
    logo: String,
    size: {
      type: String,
      enum: ['startup', 'small', 'mid', 'large', 'enterprise'],
    },
    industry: String,
  },
  position: {
    title: { type: String, required: true },
    department: String,
    level: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    },
    location: {
      city: String,
      state: String,
      country: String,
      isRemote: { type: Boolean, default: false },
      remoteType: {
        type: String,
        enum: ['fully-remote', 'hybrid', 'onsite'],
      },
    },
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' },
      period: { type: String, default: 'yearly' },
    },
  },
  jobUrl: String,
  jobDescription: String,
  // Application Status
  status: {
    type: String,
    enum: ['saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'],
    default: 'applied',
  },
  stage: {
    type: String,
    default: 'Application Submitted',
  },
  source: {
    type: String,
    enum: ['autoapply', 'manual', 'referral', 'jobboard', 'linkedin', 'company'],
    default: 'manual',
  },
  // Timeline
  appliedAt: { type: Date, default: Date.now },
  lastActivityAt: { type: Date, default: Date.now },
  closedAt: Date,
  // Details
  coverLetter: String,
  contacts: [contactSchema],
  interviews: [interviewSchema],
  notes: [noteSchema],
  nextStep: String,
  nextStepDate: Date,
  // Match Score
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  matchedSkills: [String],
  missingSkills: [String],
}, {
  timestamps: true,
});

// Update lastActivityAt on save
applicationSchema.pre('save', function(next) {
  this.lastActivityAt = new Date();
  next();
});

// Index for faster queries
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, appliedAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
