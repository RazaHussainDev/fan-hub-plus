const jwt = require('jsonwebtoken');
const { accessSecret } = require('../config/tokenConfig');

const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, accessSecret);
    
    // Fetch fresh user from DB to ensure real-time ban enforcement
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }
    if (Number(user.token_version || 0) !== Number(decoded.tokenVersion || 0)) {
      return res.status(401).json({ success: false, message: 'Session is no longer valid.' });
    }
    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact support.' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Super Admin privileges required.' });
  }
};

module.exports = { protect, isAdmin: exports.isAdmin };
