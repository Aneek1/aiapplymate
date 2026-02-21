const mongoose = require('mongoose');
const preferenceSchema = new mongoose.Schema({
  userId: { type: String, default: 'test-user-123' },
  jobTitles: { type: [String], default: ['Software Engineer'] },
  locations: { 
    type: [{
      city: { type: String, default: 'San Francisco' },
      state: { type: String, default: 'CA' },
      country: { type: String, default: 'USA' }
    }],
    default: [{ city: 'San Francisco', state: 'CA', country: 'USA' }]
  },
  jobTypes: { type: [String], default: ['full-time'] },
  industries: { type: [String], default: ['Technology'] },
  remotePreference: { type: String, default: 'no-preference' },
  experienceLevel: { type: String, default: 'entry' },
  salary: {
    min: { type: Number, default: 80000 },
    max: { type: Number, default: 150000 },
    currency: { type: String, default: 'USD' },
    period: { type: String, default: 'yearly' }
  },
  autoApply: {
    enabled: { type: Boolean, default: false },
    maxPerDay: { type: Number, default: 25 },
    platforms: { type: [String], default: ['linkedin'] }
  }
}, { timestamps: true });
module.exports = mongoose.model('Preference', preferenceSchema);
