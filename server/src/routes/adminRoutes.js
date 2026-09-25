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

const Settings = require('../models/Settings');

// Get global settings (Public route so frontend can check maintenance mode)
router.get('/settings/global', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({}); // Auto-create if doesn't exist
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Update global settings (Admin only)
router.put('/settings/global', protect, isAdmin, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {}, 
      { $set: req.body }, 
      { returnDocument: 'after', upsert: true }
    );
    res.json({ success: true, settings });
  } catch (err) {
    console.error("Settings Update Error:", err); // Logs to your backend terminal
    res.status(500).json({ success: false, message: err.message || 'Database update failed' });
  }
});

module.exports = router;
