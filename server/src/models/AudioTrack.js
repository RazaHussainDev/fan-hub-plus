const mongoose = require('mongoose');

const AudioTrackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  fandom: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'],
    index: true
  },
  type: {
    type: String,
    enum: ['OST / Soundtrack', 'Podcast', 'Theme Song', 'Remix'],
    default: 'OST / Soundtrack',
    index: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: '3:45'
  },
  plays: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  }
}, { timestamps: true });

AudioTrackSchema.index({ title: 'text', artist: 'text', fandom: 'text' });

module.exports = mongoose.model('AudioTrack', AudioTrackSchema);
