const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const requireTrustedOrigin = (req, res, next) => {
  const origin = req.get('origin');
  if (!origin) return next();

  const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    ...(process.env.NODE_ENV === 'production'
      ? []
      : ['http://localhost:3000', 'http://127.0.0.1:3000']),
  ].filter(Boolean);

  if (allowedOrigins.includes(origin)) return next();
  return res.status(403).json({ success: false, message: 'Request origin is not allowed.' });
};

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/google', authController.googleLogin);
router.post('/google-custom', authController.googleLogin);
router.post('/refresh', requireTrustedOrigin, authController.refresh);
router.post('/logout', requireTrustedOrigin, authController.logout);
router.post('/watchlist', protect, authController.toggleWatchlist);
router.get('/watchlist', protect, authController.getWatchlist);
router.patch('/watchlist/note', protect, authController.updateWatchlistNote);
router.patch('/profile', protect, authController.updateProfile);

module.exports = router;
