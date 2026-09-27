const Rating = require('../models/Rating');

// GET /api/ratings/:mediaId
exports.getMediaRatings = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const ratings = await Rating.find({ mediaId }).sort({ createdAt: -1 });

    const totalReviews = ratings.length;
    let avgStars = 0;
    let thumbsUp = 0;
    let thumbsDown = 0;

    if (totalReviews > 0) {
      const sum = ratings.reduce((acc, curr) => acc + curr.stars, 0);
      avgStars = (sum / totalReviews).toFixed(1);
      thumbsUp = ratings.filter(r => r.thumbs === 'up').length;
      thumbsDown = ratings.filter(r => r.thumbs === 'down').length;
    } else {
      // Default initial score for newly imported media
      avgStars = '4.8';
    }

    res.status(200).json({
      success: true,
      mediaId,
      avgStars: parseFloat(avgStars),
      totalReviews,
      thumbsUp,
      thumbsDown,
      reviews: ratings.slice(0, 20)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch ratings' });
  }
};

// POST /api/ratings/:mediaId (Submit / Update rating)
exports.submitRating = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { stars, thumbs = 'up', review = '', mediaType = 'movie' } = req.body;

    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    const userId = req.user?._id || req.user?.id;
    const userName = req.user?.name || 'Fan Reviewer';
    const userAvatar = req.user?.avatar || '';

    // Upsert rating (user can update their previous review)
    const rating = await Rating.findOneAndUpdate(
      { mediaId, userId },
      {
        stars,
        thumbs,
        review,
        mediaType,
        userName,
        userAvatar
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Rating and review submitted successfully!',
      rating
    });
  } catch (err) {
    console.error('Submit rating error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
