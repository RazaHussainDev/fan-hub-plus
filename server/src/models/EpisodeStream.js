const mongoose = require('mongoose');

const episodeStreamSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: String,
      required: true,
      index: true,
    },
    season: {
      type: Number,
      required: true,
    },
    episode: {
      type: Number,
      required: true,
    },
    streamUrl: {
      type: String,
      required: true,
    },
    isMultiAudio: {
      type: Boolean,
      default: false,
    },
    magnetURI: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find a specific episode
episodeStreamSchema.index({ tmdbId: 1, season: 1, episode: 1 }, { unique: true });

const EpisodeStream = mongoose.model('EpisodeStream', episodeStreamSchema);

module.exports = EpisodeStream;
