const express = require('express');
const router = express.Router();
const mediaRatingController = require('../controllers/mediaRatingController');
const { protect } = require('../middleware/auth');

router.get('/:mediaId', mediaRatingController.getMediaRatings);
router.post('/:mediaId', protect, mediaRatingController.submitRating);

module.exports = router;
