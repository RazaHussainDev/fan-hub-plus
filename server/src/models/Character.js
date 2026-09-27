const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
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
  role: {
    type: String,
    default: 'Protagonist',
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  quote: {
    type: String,
    default: ''
  },
  abilities: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  actor: {
    type: String,
    default: ''
  },
  firstAppearance: {
    type: String,
    default: ''
  },
  likesCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  }
}, { timestamps: true });

CharacterSchema.index({ name: 'text', fandom: 'text', bio: 'text' });

module.exports = mongoose.model('Character', CharacterSchema);
