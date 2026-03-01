// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract from "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_123');
    req.user = decoded; // Adds user info (id and role) to the request
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};