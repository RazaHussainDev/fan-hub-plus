const mongoose = require('mongoose');

const MerchandiseSchema = new mongoose.Schema({
  name: {
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
  fandom: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  gallery: [{
    type: String
  }],
  tag: {
    type: String,
    enum: ['Limited Edition', 'Pre-Order', 'Collectible', 'Official Merch', 'Exclusive'],
    default: 'Collectible',
    index: true
  },
  isUpcoming: {
    type: Boolean,
    default: false,
    index: true
  },
  releaseDate: {
    type: String,
    default: 'Available Now'
  },
  estimatedPrice: {
    type: String,
    default: '$79.99'
  },
  officialStoreUrl: {
    type: String,
    default: '#'
  },
  views: {
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

MerchandiseSchema.index({ name: 'text', fandom: 'text', description: 'text' });

module.exports = mongoose.model('Merchandise', MerchandiseSchema);
