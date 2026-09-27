const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

// Public feedback submission (authenticated or guest)
router.post('/', feedbackController.submitFeedback);

module.exports = router;
