const EpisodeStream = require('../models/EpisodeStream');
const ExtractorService = require('./extractorService');

class StreamAggregator {
  /**
   * Fetches the streaming link by checking the DB override first,
   * then delegating to the ExtractorService.
   * 
   * @param {string|number} tmdbId 
   * @param {string|number} season 
   * @param {string|number} episode 
   * @returns {Promise<Object>} { streamUrl: string, subtitles: Array }
   */
  static async fetchStreamLinks(tmdbId, season, episode) {
    try {
      // 1. Database Override Check (Highest Priority)
      const dbStream = await EpisodeStream.findOne({
        tmdbId: String(tmdbId),
        season: Number(season),
        episode: Number(episode)
      });

      if (dbStream && dbStream.streamUrl) {
        console.log(`[StreamAggregator] Found DB Override for TMDB ${tmdbId} S${season}E${episode}`);
        return {
          streamUrl: dbStream.streamUrl,
          subtitles: [] 
        };
      }

      // 2. Extractor Service (Public APIs & Scrapers)
      const extractedData = await ExtractorService.extractRealStream(tmdbId, season, episode);
      return extractedData;

    } catch (error) {
      console.error('[StreamAggregator] Extraction failed:', error.message);
      // Let the controller handle the error natively to return success: false
      throw error;
    }
  }
}

module.exports = StreamAggregator;
