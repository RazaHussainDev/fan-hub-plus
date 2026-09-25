const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/watchlist', protect, authController.toggleWatchlist);
router.get('/watchlist', protect, authController.getWatchlist);

const User = require('../models/User');

// TEMP ROUTE: Hit this once via Postman/Browser to make your account an admin
router.get('/make-me-admin/:email', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email }, 
      { role: 'admin' }, 
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
