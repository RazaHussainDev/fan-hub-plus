const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/', contentController.getContent);
router.get('/movies', contentController.getPublishedMovies);
router.get('/stream/engine', contentController.streamMagnet);
router.get('/stream/:tmdbId', contentController.getStream);

module.exports = router;
