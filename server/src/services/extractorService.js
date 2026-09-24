const axios = require('axios');

class ExtractorService {
  /**
   * Returns highly reliable TMDB-based Iframe providers
   */
  static async extractRealStream(tmdbId, type, season, episode) {
    let primary, backup1, backup2;

    if (type === 'movie') {
      primary = `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
      backup1 = `https://vidsrc.cc/v2/embed/movie/${tmdbId}`;
      backup2 = `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`;
    } else {
      primary = `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
      backup1 = `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`;
      backup2 = `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
    }

    return {
      primary,
      backup1,
      backup2
    };
  }
}

module.exports = ExtractorService;
