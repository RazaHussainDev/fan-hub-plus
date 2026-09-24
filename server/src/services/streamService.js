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
  static async fetchStreamLinks(tmdbId, type, season, episode) {
    try {
      // 1. Database Override Check (Highest Priority) - Skip for movies since EpisodeStream is for TV
      if (type !== 'movie') {
        const dbStream = await EpisodeStream.findOne({
          tmdbId: String(tmdbId),
          season: Number(season),
          episode: Number(episode)
        });

        if (dbStream) {
          if (dbStream.magnetURI) {
            console.log(`[StreamAggregator] Found Torrent DB Override for ${tmdbId} S${season}E${episode}`);
            return {
              isTorrent: true,
              streamUrl: "http://localhost:5000/api/content/stream/engine?magnet=" + encodeURIComponent(dbStream.magnetURI),
              subtitles: []
            };
          } else if (dbStream.streamUrl) {
            console.log(`[StreamAggregator] Found Direct DB Override for ${tmdbId} S${season}E${episode}`);
            return {
              isTorrent: false,
              streamUrl: dbStream.streamUrl,
              subtitles: [] 
            };
          }
        }
      }

      // 2. Extractor Service (Public APIs & Scrapers)
      const extractedData = await ExtractorService.extractRealStream(tmdbId, type, season, episode);
      return extractedData;

    } catch (error) {
      console.error('[StreamAggregator] Extraction failed:', error.message);
      // Let the controller handle the error natively to return success: false
      throw error;
    }
  }
}

module.exports = StreamAggregator;
