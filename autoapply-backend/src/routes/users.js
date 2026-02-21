const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [{ id: 'test-user-123', email: 'test@example.com' }] });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, data: { id: req.params.id, email: 'test@example.com' } });
});

router.put('/:id', (req, res) => {
  res.json({ success: true, data: { id: req.params.id, ...req.body } });
});

router.delete('/:id', (req, res) => {
  res.json({ success: true, message: `User ${req.params.id} deleted` });
});

module.exports = router;
