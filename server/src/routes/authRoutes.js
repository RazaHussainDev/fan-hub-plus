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
      { returnDocument: 'after' }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// TEMP ROUTE: Hit this to update the email address
router.get('/update-my-email', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: 'acchacked.pk@gmail.com' }, // Find the old email
      { email: 'razacode404@gmail.com' }, // Replace with the new email
      { returnDocument: 'after' }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Old email not found' });
    }

    res.json({ success: true, message: 'Email successfully updated to razacode404@gmail.com', user });
  } catch (err) {
    res.status(500).json({ error: 'Database update failed', details: err.message });
  }
});

module.exports = router;
