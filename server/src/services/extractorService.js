const axios = require('axios');

class ExtractorService {
  /**
   * Fetches streams using the Stremio Addon Protocol (Torrentio)
   * focusing on aggressive multi-audio and Hindi dubs.
   * 
   * @param {string|number} tmdbId - We will convert this to IMDB ID manually for the PoC.
   * @param {string|number} season 
   * @param {string|number} episode 
   * @returns {Promise<Object>} { streamUrl: string, subtitles: Array }
   */
  static async extractRealStream(tmdbId, season, episode) {
    // For PoC: Money Heist TMDB 71446 corresponds to IMDB tt6468322
    const imdbId = tmdbId.toString() === '71446' ? 'tt6468322' : tmdbId;

    try {
      console.log(`[ExtractorService] Querying Torrentio for ${imdbId} S${season}E${episode}`);
      const torrentioUrl = `https://torrentio.strem.fun/stream/series/${imdbId}:${season}:${episode}.json`;
      
      const { data } = await axios.get(torrentioUrl, { timeout: 10000 });

      if (data && data.streams && data.streams.length > 0) {
        // Filter for Multi-Audio or Hindi
        const multiAudioStreams = data.streams.filter(stream => {
          const title = stream.title || stream.name || '';
          return /hindi|multi|dual/i.test(title);
        });

        // Pick the best stream (fallback to first if no multi-audio found)
        const targetStream = multiAudioStreams.length > 0 ? multiAudioStreams[0] : data.streams[0];

        let primaryUrl = '';
        if (targetStream.infoHash) {
          console.log(`[ExtractorService] Extracted infoHash: ${targetStream.infoHash}`);
          primaryUrl = `https://webtor.io/api/watch/torrent/${targetStream.infoHash}/download`;
        } else if (targetStream.url) {
          console.log(`[ExtractorService] Extracted direct HTTP URL from Torrentio.`);
          primaryUrl = targetStream.url;
        }

        if (primaryUrl) {
          return {
            primary: primaryUrl,
            backup1: `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}`,
            backup2: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
            backup3: `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`
          };
        }
      }

    } catch (error) {
      console.warn(`[ExtractorService] Stremio Protocol (Torrentio) extraction failed:`, error.message);
    }

    // If extraction fails, throw 404 to trigger frontend AutoEmbed iframe fallback
    const notFoundError = new Error('No playable streams found via Stremio Addon Protocol.');
    notFoundError.status = 404;
    throw notFoundError;
  }
}

module.exports = ExtractorService;
