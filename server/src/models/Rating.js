const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  mediaId: {
    type: String,
    required: true,
    index: true
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv', 'fandom', 'audio'],
    default: 'movie',
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    default: 'Fan Reviewer'
  },
  userAvatar: {
    type: String,
    default: ''
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  thumbs: {
    type: String,
    enum: ['up', 'down'],
    default: 'up'
  },
  review: {
    type: String,
    default: '',
    trim: true
  }
}, { timestamps: true });

// Prevent duplicate review per user per media
RatingSchema.index({ mediaId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);
