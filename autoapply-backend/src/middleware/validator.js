const { body, param, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth validators
exports.registerValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
];

exports.loginValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Resume validators
exports.createResumeValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Resume name is required'),
];

// Application validators
exports.createApplicationValidator = [
  body('company.name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('position.title')
    .trim()
    .notEmpty()
    .withMessage('Position title is required'),
  body('status')
    .optional()
    .isIn(['saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'])
    .withMessage('Invalid status'),
];

exports.updateApplicationValidator = [
  body('status')
    .optional()
    .isIn(['saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'])
    .withMessage('Invalid status'),
  body('stage')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Stage cannot be empty'),
];

// Preference validators
exports.updatePreferenceValidator = [
  body('remotePreference')
    .optional()
    .isIn(['remote-only', 'hybrid', 'onsite', 'no-preference'])
    .withMessage('Invalid remote preference'),
  body('experienceLevel')
    .optional()
    .isIn(['entry', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
  body('autoApply.enabled')
    .optional()
    .isBoolean()
    .withMessage('Auto apply enabled must be a boolean'),
  body('autoApply.maxApplicationsPerDay')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Max applications per day must be between 1 and 100'),
];

// Param validators
exports.idParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];
