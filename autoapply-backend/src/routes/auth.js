const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth route working' });
});

router.post('/register', (req, res) => {
  const token = jwt.sign(
    { id: 'test-user-123', email: req.body.email || 'test@example.com' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '7d' }
  );
  res.json({
    success: true,
    data: {
      user: { id: 'test-user-123', email: req.body.email || 'test@example.com' },
      token
    }
  });
});

router.post('/login', (req, res) => {
  const token = jwt.sign(
    { id: 'test-user-123', email: req.body.email || 'test@example.com' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '7d' }
  );
  res.json({
    success: true,
    data: {
      user: { id: 'test-user-123', email: req.body.email || 'test@example.com' },
      token
    }
  });
});

router.get('/me', (req, res) => {
  res.json({
    success: true,
    data: { id: 'test-user-123', email: 'test@example.com' }
  });
});

module.exports = router;
