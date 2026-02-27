const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

exports.protect = (req, res, next) => {
  // If test user middleware already set req.user, skip JWT check (open-source mode)
  if (req.user) {
    return next();
  }

  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '')
      : null;

    if (!token) {
      return errorResponse(res, 'Not authorized, no token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    return errorResponse(res, 'Not authorized, token failed', 401);
  }
};
