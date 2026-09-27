const express = require('express');
const router = express.Router();
const { manager } = require('../ai/nlpManager');
const Movie = require('../models/Movie');
const FandomContent = require('../models/FandomContent');

const formatMovie = (m) => ({
  _id: m._id,
  title: m.title,
  posterUrl: m.posterPath 
    ? (m.posterPath.startsWith('http') ? m.posterPath : `https://image.tmdb.org/t/p/w500${m.posterPath}`) 
    : (m.poster || ''),
  tmdbId: m.tmdbId || m._id,
  mediaType: m.mediaType || 'movie',
  voteAverage: m.voteAverage || m.rating || 8.5
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const response = await manager.process('en', message);
    let answer = response.answer || "Sorry, mujhe theek se samajh nahi aaya. Can you try again?";
    let rawMovies = [];

    // Logic 1: Find by Genre
    if (answer.includes('||ACTION:FETCH_GENRE')) {
      const genreEntity = response.entities && response.entities.find(e => e.entity === 'genre');
      if (genreEntity) {
        const genreName = genreEntity.option || genreEntity.utteranceText;
        answer = answer.replace(/%genre%/g, genreName).replace('||ACTION:FETCH_GENRE', '');
        
        const genreRegex = new RegExp(genreName, 'i');
        rawMovies = await Movie.find({
          $or: [{ genre: genreRegex }, { genres: genreRegex }, { category: genreRegex }]
        }).limit(5);

        if (!rawMovies || rawMovies.length === 0) {
          rawMovies = await FandomContent.find({
            $or: [{ category: genreRegex }, { genres: genreRegex }, { fandom: genreRegex }]
          }).limit(5);
        }
      } else {
        answer = answer.replace(/%genre%/g, 'trending').replace('||ACTION:FETCH_GENRE', '');
        rawMovies = await Movie.find().sort({ createdAt: -1 }).limit(4);
      }
    }
    
    // Logic 2: Search specific movie
    else if (answer.includes('||ACTION:SEARCH_MOVIE')) {
      const movieEntity = response.entities && response.entities.find(e => e.entity === 'movie');
      const searchTarget = movieEntity ? (movieEntity.option || movieEntity.utteranceText) : message;
      
      answer = answer.replace(/%movie%/g, searchTarget).replace('||ACTION:SEARCH_MOVIE', '');

      const titleRegex = new RegExp(searchTarget, 'i');
      rawMovies = await Movie.find({ title: titleRegex }).limit(4);

      if (!rawMovies || rawMovies.length === 0) {
        rawMovies = await FandomContent.find({ title: titleRegex }).limit(4);
      }

      // If still nothing found, fetch top 3 related
      if (!rawMovies || rawMovies.length === 0) {
        rawMovies = await Movie.find().sort({ createdAt: -1 }).limit(3);
      }
    }

    // Logic 3: Trending
    else if (answer.includes('||ACTION:FETCH_TRENDING')) {
      answer = answer.replace('||ACTION:FETCH_TRENDING', '');
      rawMovies = await Movie.find({ isPublished: { $ne: false } }).sort({ createdAt: -1 }).limit(5);
      
      if (!rawMovies || rawMovies.length === 0) {
        rawMovies = await FandomContent.find().sort({ popularity: -1, rating: -1 }).limit(5);
      }
    }

    const movies = (rawMovies || []).map(formatMovie);

    res.json({
      success: true,
      reply: answer.trim(),
      intent: response.intent,
      entities: response.entities || [],
      movies
    });
  } catch (error) {
    console.error('AI Engine Error:', error.message);
    res.status(500).json({ success: false, message: 'AI Engine Error' });
  }
});

module.exports = router;
