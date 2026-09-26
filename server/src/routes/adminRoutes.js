const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');
const User = require('../models/User');

router.get('/dashboard-stats', adminController.getDashboardStats);
router.post('/seed-stream', adminController.seedStream);

router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = 124; // Mock for now if Movie model isn't ready
    const activeStreams = Math.floor(Math.random() * 50) + 10; // Mock real-time data

    res.json({ success: true, stats: { totalUsers, totalMovies, activeStreams, serverHealth: '99.9%' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

const Settings = require('../models/Settings');

// Get global settings (Public route so frontend can check maintenance mode)
router.get('/settings/global', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({}); // Auto-create if doesn't exist
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Update global settings (Admin only)
router.put('/settings/global', protect, isAdmin, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {}, 
      { $set: req.body }, 
      { returnDocument: 'after', upsert: true }
    );
    res.json({ success: true, settings });
  } catch (err) {
    console.error("Settings Update Error:", err); // Logs to your backend terminal
    res.status(500).json({ success: false, message: err.message || 'Database update failed' });
  }
});

const Movie = require('../models/Movie');

// Fetch data from TMDB (Native fetch)
router.get('/tmdb/fetch/:type/:id', protect, isAdmin, async (req, res) => {
  try {
    const { type, id } = req.params; // 'movie' or 'tv'
    const tmdbUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`;

    const response = await fetch(tmdbUrl);
    if (!response.ok) throw new Error(`TMDB responded with ${response.status}`);
    
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    console.error("TMDB Fetch Error:", err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch from TMDB. Check ID or API Key.' });
  }
});

// Import TMDB Movie/Show into MongoDB
router.post('/movies/import', protect, isAdmin, async (req, res) => {
  try {
    const { id, title, name, overview, poster_path, backdrop_path, media_type, release_date, first_air_date, vote_average } = req.body;
    
    const mediaType = media_type || (title ? 'movie' : 'tv');
    const finalTitle = title || name;
    const finalReleaseDate = release_date || first_air_date;

    if (!finalTitle || !id) {
      return res.status(400).json({ success: false, message: 'Missing essential data' });
    }

    const newMovie = await Movie.findOneAndUpdate(
      { tmdbId: String(id) },
      {
        title: finalTitle,
        description: overview,
        posterPath: poster_path,
        backdropPath: backdrop_path,
        mediaType: mediaType,
        releaseDate: finalReleaseDate,
        voteAverage: vote_average
      },
      { upsert: true, returnDocument: 'after' }
    );

    res.json({ success: true, message: 'Successfully imported', data: newMovie });
  } catch (err) {
    console.error("Import Error:", err.message);
    res.status(500).json({ success: false, message: 'Failed to save to database.' });
  }
});

// Search TMDB by Name
router.get('/tmdb/search/:type/:query', protect, isAdmin, async (req, res) => {
  try {
    const { type, query } = req.params;
    const response = await fetch(`https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(query)}&api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    res.json({ success: true, results: data.results });
  } catch (err) {
    console.error("TMDB Search Error:", err.message);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

// Get all database movies for Admin Library
router.get('/movies/library', protect, isAdmin, async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ success: true, movies });
  } catch (err) {
    console.error("Library Fetch Error:", err.message);
    res.status(500).json({ success: false });
  }
});

// Toggle Publish/Revoke Status
router.patch('/movies/:id/toggle', protect, isAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });
    
    movie.isPublished = !movie.isPublished;
    await movie.save();
    res.json({ success: true, isPublished: movie.isPublished });
  } catch (err) {
    console.error("Toggle Error:", err.message);
    res.status(500).json({ success: false });
  }
});



// Get all users
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Toggle User Role (Make Admin / Revert to User)
router.patch('/users/:id/role', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if(user.role === 'superadmin') return res.status(400).json({ success: false, message: 'Cannot change superadmin role' });

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    res.json({ success: true, role: user.role });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Toggle Ban Status
router.patch('/users/:id/ban', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if(user.role === 'superadmin') return res.status(400).json({ success: false, message: 'Cannot ban superadmin' });

    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ success: true, isBanned: user.isBanned });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
