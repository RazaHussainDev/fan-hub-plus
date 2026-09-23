const EpisodeStream = require('../models/EpisodeStream');

// Admin Controller - Dummy dashboard wiring
exports.getDashboardStats = (req, res) => {
  res.status(200).json({ success: true, data: { status: "wired" }, message: "Admin Dashboard wired" });
};

// Admin Controller - Seed Stream Override
exports.seedStream = async (req, res) => {
  try {
    const { tmdbId, season, episode, streamUrl, isMultiAudio } = req.body;

    if (!tmdbId || season == null || episode == null || !streamUrl) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Missing required fields: tmdbId, season, episode, streamUrl'
      });
    }

    const newStream = await EpisodeStream.findOneAndUpdate(
      { tmdbId: String(tmdbId), season: Number(season), episode: Number(episode) },
      { streamUrl, isMultiAudio: !!isMultiAudio },
      { new: true, upsert: true } // Create if doesn't exist, update if it does
    );

    res.status(201).json({
      success: true,
      data: newStream,
      message: 'Episode stream successfully seeded/updated'
    });
  } catch (error) {
    console.error('[AdminController] seedStream error:', error.message);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error while seeding stream'
    });
  }
};
