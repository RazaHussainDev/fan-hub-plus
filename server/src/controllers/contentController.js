const StreamAggregator = require('../services/streamService');

// Content Controller - Dummy wiring
exports.getContent = (req, res) => {
  res.status(200).json({ success: true, data: { status: "wired" }, message: "Content wired" });
};

// Stream API endpoint
exports.getStream = async (req, res) => {
  try {
    const { tmdbId } = req.params; // Using tmdbId as param name, but it is now imdbId
    const { type, season, episode } = req.query;

    if (!tmdbId) {
      return res.status(400).json({ 
        success: false, 
        data: null, 
        message: 'ID is required' 
      });
    }

    const streamData = await StreamAggregator.fetchStreamLinks(tmdbId, type, season, episode);

    if (!streamData || (!streamData.streamUrl && !streamData.primary)) {
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

const TorrentService = require('../services/torrentService');

exports.streamMagnet = (req, res) => {
  try {
    TorrentService.streamMagnet(req, res);
  } catch (error) {
    console.error('[ContentController] streamMagnet error:', error.message);
    res.status(500).send('Internal server error while streaming magnet');
  }
};


