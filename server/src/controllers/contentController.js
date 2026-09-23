const StreamAggregator = require('../services/streamService');

// Content Controller - Dummy wiring
exports.getContent = (req, res) => {
  res.status(200).json({ success: true, data: { status: "wired" }, message: "Content wired" });
};

// Stream API endpoint
exports.getStream = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const { season, episode } = req.query;

    if (!tmdbId) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'TMDB ID is required' 
      });
    }

    const streamData = await StreamAggregator.fetchStreamLinks(tmdbId, season, episode);

    if (!streamData || !streamData.streamUrl) {
      return res.status(404).json({ 
        success: false, 
        data: null, 
        message: 'No streaming links found for this content' 
      });
    }

    return res.status(200).json({
      success: true,
      data: streamData,
      message: 'Stream successfully aggregated'
    });
  } catch (error) {
    console.error('[ContentController] getStream error:', error.message);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error while fetching stream'
    });
  }
};
