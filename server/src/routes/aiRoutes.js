const express = require('express');
const router = express.Router();
const { manager } = require('../ai/nlpManager');
const Movie = require('../models/Movie');
const FandomContent = require('../models/FandomContent');

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const response = await manager.process('en', message);
    let answer = response.answer || "Sorry, main thoda samajh nahi paya. Can you rephrase?";
    let movies = [];

    // Check if the AI wants to trigger a movie fetch
    if (answer.includes('||ACTION:FETCH_TRENDING')) {
      answer = answer.replace('||ACTION:FETCH_TRENDING', '').trim();
      
      // Fetch latest/trending movies from MongoDB
      const dbMovies = await Movie.find({ isPublished: { $ne: false } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title posterPath backdropPath tmdbId mediaType voteAverage');

      if (dbMovies && dbMovies.length > 0) {
        movies = dbMovies.map(m => ({
          _id: m._id,
          title: m.title,
          posterUrl: m.posterPath 
            ? (m.posterPath.startsWith('http') ? m.posterPath : `https://image.tmdb.org/t/p/w500${m.posterPath}`) 
            : '',
          tmdbId: m.tmdbId,
          mediaType: m.mediaType || 'movie',
          voteAverage: m.voteAverage || 8.0
        }));
      } else {
        // Fallback to FandomContent collection
        const fandomItems = await FandomContent.find()
          .sort({ popularity: -1, rating: -1 })
          .limit(5)
          .select('title poster category rating');

        movies = fandomItems.map(f => ({
          _id: f._id,
          title: f.title,
          posterUrl: f.poster,
          category: f.category,
          mediaType: 'movie',
          voteAverage: f.rating
        }));
      }
    }

    res.json({ success: true, reply: answer, intent: response.intent, movies });
  } catch (error) {
    console.error('AI Route Error:', error.message);
    res.status(500).json({ success: false, message: 'AI Error' });
  }
});

module.exports = router;
