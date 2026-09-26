const express = require('express');
const router = express.Router();
const fandomController = require('../controllers/fandomController');

// Public Explore Fandom Endpoint with Advanced Filters
router.get('/explore', fandomController.getExploreContent);

// Fandom Statistics by Category
router.get('/stats', fandomController.getFandomStats);

module.exports = router;
