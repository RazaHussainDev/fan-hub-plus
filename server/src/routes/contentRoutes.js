const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/', contentController.getContent);
router.get('/stream/engine', contentController.streamMagnet);
router.get('/stream/transcode', contentController.transcodeMagnet);
router.get('/stream/:tmdbId', contentController.getStream);

module.exports = router;
