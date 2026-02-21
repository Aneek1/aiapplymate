const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini/gemini.service');

router.post('/optimize-resume', async (req, res) => {
  try {
    const { resumeText, jobTitle, industry } = req.body;
    const result = await geminiService.optimizeResume(resumeText, jobTitle, industry);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/calculate-ats', async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;
    const result = await geminiService.calculateATSScore(jobDescription, resumeText);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/tailor-resume', async (req, res) => {
  try {
    const { jobDescription, resumeText, jobTitle, company } = req.body;
    const result = await geminiService.tailorResume(jobDescription, resumeText, jobTitle, company);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
