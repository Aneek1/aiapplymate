const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const geminiService = require('../services/gemini/gemini.service');
const { Resume } = require('../models');
const { protect } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/response');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// GET all resumes for the logged in user
router.get('/', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
    successResponse(res, resumes);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

// GET primary resume
router.get('/primary', protect, async (req, res) => {
  try {
    let primary = await Resume.findOne({ user: req.user.id, isDefault: true });
    if (!primary) {
      primary = await Resume.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    }

    if (!primary) {
      return errorResponse(res, 'No resume found', 404);
    }

    successResponse(res, primary);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

// GET single resume
router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 404);
    }
    successResponse(res, resume);
  } catch (error) {
    errorResponse(res, error.message);
  }
});

// DELETE resume
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return errorResponse(res, 'Resume not found', 404);
    }

    // If we deleted the default, set a new one
    if (resume.isDefault) {
      const another = await Resume.findOne({ user: req.user.id });
      if (another) {
        another.isDefault = true;
        await another.save();
      }
    }

    successResponse(res, null, 'Resume deleted successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
});

module.exports = router;
