const mongoose = require('mongoose');

const FandomContentSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
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
    trim: true,
    index: true 
  },
  type: { 
    type: String, 
    enum: ['video', 'article', 'gallery', 'stream', 'audio'], 
    default: 'video' 
  },
  description: { 
    type: String, 
    default: '' 
  },
  poster: { 
    type: String, 
    default: '' 
  },
  backdrop: { 
    type: String, 
    default: '' 
  },
  genres: [{ 
    type: String, 
    trim: true 
  }],
  releaseYear: { 
    type: Number, 
    default: new Date().getFullYear(),
    index: true
  },
  rating: { 
    type: Number, 
    default: 8.5,
    min: 0,
    max: 10,
    index: true
  },
  popularity: { 
    type: Number, 
    default: 85,
    index: true
  },
  streamUrl: { 
    type: String, 
    default: '' 
  },
  trailerUrl: {
    type: String,
    default: ''
  },
  tags: [{ 
    type: String 
  }],
  isPublished: { 
    type: Boolean, 
    default: true,
    index: true 
  },
  featured: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

// Text search index for title, fandom, description, and tags
FandomContentSchema.index({ title: 'text', fandom: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('FandomContent', FandomContentSchema);
