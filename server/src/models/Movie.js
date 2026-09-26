const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  posterPath: { type: String, default: '' },
  backdropPath: { type: String, default: '' },
  tmdbId: { type: String, required: true, unique: true },
  mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
  releaseDate: { type: String, default: '' },
  voteAverage: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);
