const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini/gemini.service');
const pdfService = require('../services/pdf.service');
const { Resume } = require('../models');
const { protect } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/response');

router.post('/optimize-resume', protect, async (req, res) => {
  try {
    const { resumeText, jobTitle, industry } = req.body;
    const result = await geminiService.optimizeResume(resumeText, jobTitle, industry);
    successResponse(res, result);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
});

router.post('/calculate-ats', protect, async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;
    const result = await geminiService.calculateATSScore(jobDescription, resumeText);
    successResponse(res, result);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
});

router.post('/tailor-resume', protect, async (req, res) => {
  try {
    const { jobDescription, resumeText, jobTitle, company } = req.body;
    const result = await geminiService.tailorResume(jobDescription, resumeText, jobTitle, company);
    successResponse(res, result);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
});

router.post('/generate-cover-letter', protect, async (req, res) => {
  try {
    const { jobDescription, resumeText, jobTitle, company } = req.body;
    const result = await geminiService.generateCoverLetter(jobDescription, resumeText, jobTitle, company);
    successResponse(res, result);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
});

router.post('/tailor-full', protect, async (req, res) => {
  try {
    const { jobDescription, resumeText, jobTitle, company } = req.body;
    const result = await geminiService.tailorFull(jobDescription, resumeText, jobTitle, company);
    successResponse(res, result);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
});

router.post('/save-tailored', protect, async (req, res) => {
  try {
    const { name, tailoredResume, atsScore, jobTitle, company, keywordsAdded, coverLetter } = req.body;
    const { email, phone, location } = req.body;

    const resume = await Resume.create({
      user: req.user.id,
      name: name || `Tailored: ${jobTitle} at ${company}`,
      summary: tailoredResume ? tailoredResume.substring(0, 500) + '...' : '',
      content: tailoredResume,
      coverLetter: coverLetter,
      atsScore: atsScore || 0,
      aiOptimized: true,
      headline: `${jobTitle} at ${company}`,
      keywords: keywordsAdded || []
    });

    successResponse(res, resume, 'Tailored resume saved successfully');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
});

router.post('/download-tailored-resume', protect, async (req, res) => {
  try {
    const { message, resumeText, tailoredResume, name, email, phone, location, jobTitle, summary, keywordsAdded, template } = req.body;
    const html = pdfService.generateResumeHTML({ 
      tailoredResume, 
      name, 
      email, 
      phone, 
      location, 
      jobTitle,
      summary, 
      keywordsAdded,
      template 
    });
    const pdfBuffer = await pdfService.generatePDF(html);

    console.log(`PDF Generated for User ${req.user.id}: ${pdfBuffer.length} bytes. Header:`, pdfBuffer.slice(0, 10).toString());

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=tailored-resume.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(Buffer.from(pdfBuffer), 'binary');
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/download-cover-letter', protect, async (req, res) => {
  try {
    const { coverLetter, name, email, phone, company } = req.body;
    const html = pdfService.generateCoverLetterHTML({ coverLetter, name, email, phone, company });
    const pdfBuffer = await pdfService.generatePDF(html);

    console.log(`Cover Letter Generated for User ${req.user.id}: ${pdfBuffer.length} bytes. Header:`, pdfBuffer.slice(0, 10).toString());

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cover-letter.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(Buffer.from(pdfBuffer), 'binary');
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
