const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');
const User = require('../models/User');

router.get('/dashboard-stats', adminController.getDashboardStats);
router.post('/seed-stream', adminController.seedStream);

router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = 124; // Mock for now if Movie model isn't ready
    const activeStreams = Math.floor(Math.random() * 50) + 10; // Mock real-time data

    res.json({ success: true, stats: { totalUsers, totalMovies, activeStreams, serverHealth: '99.9%' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

module.exports = router;
