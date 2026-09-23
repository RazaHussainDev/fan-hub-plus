const axios = require('axios');

class StreamAggregator {
  /**
   * Fetches the raw .m3u8 HLS streaming link and associated subtitles for a given TMDB ID.
   * 
   * @param {string|number} tmdbId 
   * @param {string|number} season 
   * @param {string|number} episode 
   * @returns {Promise<Object>} { streamUrl: string, subtitles: Array }
   */
  static async fetchStreamLinks(tmdbId, season, episode) {
    try {
      // Primary Source: Consumet API (TMDB Meta Provider)
      try {
        const consumetUrl = `https://api.consumet.org/meta/tmdb/info/${tmdbId}?type=tv`;
        const { data } = await axios.get(consumetUrl, { timeout: 5000 });
        
        if (data && data.episodes) {
          const ep = data.episodes.find(
            e => e.season === Number(season) && e.number === Number(episode)
          );
          
          if (ep) {
            const streamRes = await axios.get(`https://api.consumet.org/meta/tmdb/watch/${ep.id}?id=${tmdbId}`, { timeout: 5000 });
            
            if (streamRes.data && streamRes.data.sources) {
              const source = streamRes.data.sources.find(s => s.isM3U8 || s.url.includes('.m3u8'));
              
              if (source) {
                return {
                  streamUrl: source.url,
                  subtitles: streamRes.data.subtitles || []
                };
              }
            }
          }
        }
      } catch (consumetError) {
        console.warn(`[StreamAggregator] Primary API (Consumet) failed for TMDB ${tmdbId}:`, consumetError.message);
      }

      // Secondary Source: Scraping public embedded network (e.g., autoembed)
      try {
        const fallbackUrl = `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`;
        const fallbackRes = await axios.get(fallbackUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
          },
          timeout: 5000
        });

        // Basic Regex to extract any exposed .m3u8 stream link in the raw HTML or JS configuration
        const m3u8Match = fallbackRes.data.match(/(https:\/\/[^"']*\.m3u8[^"']*)/);
        
        if (m3u8Match && m3u8Match[1]) {
          return {
            streamUrl: m3u8Match[1],
            subtitles: [] // Generic scrapers rarely expose subtitles natively without deep evaluation
          };
        }
      } catch (scraperError) {
        console.warn(`[StreamAggregator] Scraper fallback failed for TMDB ${tmdbId}:`, scraperError.message);
      }

      // If we reach this point, the external episodes do not exist or are completely blocked
      const notFoundError = new Error('Streaming links not found on any external providers');
      notFoundError.status = 404;
      throw notFoundError;

    } catch (error) {
      console.error('[StreamAggregator] Error fetching stream links:', error.message);
      throw error;
    }
  }
}

module.exports = StreamAggregator;
