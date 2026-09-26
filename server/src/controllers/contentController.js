const StreamAggregator = require('../services/streamService');

// Content Controller - Dummy wiring
exports.getContent = (req, res) => {
  res.status(200).json({ success: true, data: { status: "wired" }, message: "Content wired" });
};

// Stream API endpoint
exports.getStream = async (req, res) => {
  try {
    const { tmdbId } = req.params;
    const type = req.query.type || 'movie';
    const season = req.query.season ? parseInt(req.query.season) : 1;
    const episode = req.query.episode ? parseInt(req.query.episode) : 1;

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

const Movie = require('../models/Movie');

exports.getPublishedMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({ isPublished: true })
                              .sort({ createdAt: -1 })
                              .skip(skip)
                              .limit(limit);

    const mappedMovies = movies.map(m => ({
      id: m.tmdbId,
      title: m.title,
      name: m.title,
      poster_path: m.posterPath,
      backdrop_path: m.backdropPath,
      media_type: m.mediaType,
      vote_average: m.voteAverage,
      release_date: m.releaseDate
    }));

    res.status(200).json({ success: true, results: mappedMovies, page });
  } catch (error) {
    console.error('[ContentController] getPublishedMovies error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
