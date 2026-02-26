const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  startDate: { type: Date, required: true },
  endDate: Date,
  isCurrent: { type: Boolean, default: false },
  description: String,
  achievements: [String],
});

const educationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: String,
  location: String,
  startDate: Date,
  endDate: Date,
  gpa: String,
});

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate',
  },
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  fileType: {
    type: String,
    enum: ['pdf', 'docx', 'txt'],
  },
  // Parsed/Structured Data
  headline: String,
  summary: String,
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  certifications: [String],
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['basic', 'conversational', 'fluent', 'native'],
    },
  }],
  // ATS Analysis
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  atsFeedback: [{
    category: String,
    message: String,
    severity: {
      type: String,
      enum: ['info', 'warning', 'error'],
    },
  }],
  keywords: [String],
  // AI Generated Content
  aiOptimized: {
    type: Boolean,
    default: false,
  },
  optimizedFor: [{
    jobTitle: String,
    date: Date,
  }],
  content: String,
  coverLetter: String,
}, {
  timestamps: true,
});

// Ensure only one default resume per user
resumeSchema.pre('save', async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
