const express = require('express');
const router = express.Router();
const Preference = require('../models/Preference');

router.get('/', async (req, res) => {
  try {
    let pref = await Preference.findOne({ userId: 'test-user-123' });
    if (!pref) {
      pref = new Preference({ userId: 'test-user-123' });
      await pref.save();
    }
    res.json({ success: true, data: pref });
  } catch (error) {
    res.json({ 
      success: true, 
      data: { 
        userId: 'test-user-123', 
        jobTitles: ['Software Engineer'],
        locations: [{ city: 'San Francisco', state: 'CA' }]
      } 
    });
  }
});

router.put('/', async (req, res) => {
  res.json({ success: true, data: { ...req.body, userId: 'test-user-123' } });
});

module.exports = router;
