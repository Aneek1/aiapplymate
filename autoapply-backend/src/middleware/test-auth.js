module.exports = (req, res, next) => {
  req.user = { id: 'test-user-123', email: 'test@example.com' };
  next();
};
