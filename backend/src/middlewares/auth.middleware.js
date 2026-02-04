const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../config/env');
const { ROLES } = require('../constants/roles');

const authenticateToken = (req, res, next) => {
  // 🔥 Read token from cookies first (cookie-based auth)
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    req.user = decoded;
    next();
  });
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

const checkOwnership = (resourceField = 'user_id') => {
  return (req, res, next) => {
    // Admins can access all resources
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    // Users can only access their own resources
    if (req.user.id !== req[resourceField]) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only access your own resources'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorize,
  checkOwnership
};
