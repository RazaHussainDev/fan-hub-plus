const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'],
    index: true
  },
  fandom: {
    type: String,
    default: 'General',
    trim: true
  },
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'Fan Contributor' },
    avatar: { type: String, default: '' },
    role: { type: String, default: 'Community Fan' }
  },
  coverImage: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  readTime: {
    type: String,
    default: '4 min read'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  }
}, { timestamps: true });

ArticleSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);
