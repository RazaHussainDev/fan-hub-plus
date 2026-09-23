const axios = require('axios');
const cheerio = require('cheerio');

class ExtractorService {
  /**
   * Attempts to extract a real, playable .m3u8 stream from public aggregators and APIs.
   * Built robustly to try multiple endpoints and HTML scraping techniques.
   * 
   * @param {string|number} tmdbId 
   * @param {string|number} season 
   * @param {string|number} episode 
   * @returns {Promise<Object>} { streamUrl: string, subtitles: Array }
   */
  static async extractRealStream(tmdbId, season, episode) {
    // 1. Attempt Primary API Source: Consumet (TMDB Info -> Watch endpoint)
    try {
      const consumetInfoUrl = `https://api.consumet.org/meta/tmdb/info/${tmdbId}?type=tv`;
      const { data: infoData } = await axios.get(consumetInfoUrl, { timeout: 6000 });
      
      if (infoData && infoData.episodes) {
        const targetEp = infoData.episodes.find(
          e => e.season === Number(season) && e.number === Number(episode)
        );
        
        if (targetEp) {
          const watchUrl = `https://api.consumet.org/meta/tmdb/watch/${targetEp.id}?id=${tmdbId}`;
          const { data: watchData } = await axios.get(watchUrl, { timeout: 6000 });
          
          if (watchData && watchData.sources) {
            const source = watchData.sources.find(s => s.isM3U8 || s.url.includes('.m3u8'));
            if (source) {
              console.log(`[ExtractorService] Successfully extracted stream from Consumet API for TMDB ${tmdbId}`);
              return {
                streamUrl: source.url,
                subtitles: watchData.subtitles || []
              };
            }
          }
        }
      }
    } catch (consumetError) {
      console.warn(`[ExtractorService] Consumet API failed for TMDB ${tmdbId}:`, consumetError.message);
    }

    // 2. Attempt Scraper Source: AutoEmbed / Vidsrc clones
    // We scrape the HTML payload looking for exposed .m3u8 links in source tags or config JSON
    try {
      const fallbackUrl = `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`;
      const { data: html } = await axios.get(fallbackUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          'Referer': 'https://autoembed.co/'
        },
        timeout: 6000
      });

      const $ = cheerio.load(html);
      
      // Look for standard source tags
      const sourceTag = $('source').attr('src');
      if (sourceTag && sourceTag.includes('.m3u8')) {
        console.log(`[ExtractorService] Extracted .m3u8 from <source> tag on AutoEmbed`);
        return { streamUrl: sourceTag, subtitles: [] };
      }

      // Regex fallback: Search the raw JS bundle strings for a master m3u8 playlist
      const m3u8Regex = /(https:\/\/[^"']*\.m3u8[^"']*)/i;
      const match = html.match(m3u8Regex);
      if (match && match[1]) {
        console.log(`[ExtractorService] Extracted .m3u8 via Regex on AutoEmbed`);
        return { streamUrl: match[1], subtitles: [] };
      }
    } catch (scraperError) {
      console.warn(`[ExtractorService] HTML Scraper failed for TMDB ${tmdbId}:`, scraperError.message);
    }

    // If all extraction attempts fail, throw an error to trigger frontend iframe fallback
    const notFoundError = new Error('No playable .m3u8 streams found across all extractor engines.');
    notFoundError.status = 404;
    throw notFoundError;
  }
}

module.exports = ExtractorService;
