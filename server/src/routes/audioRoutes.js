const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');

router.get('/', audioController.getAudioTracks);
router.patch('/:id/like', audioController.likeAudioTrack);
router.post('/:id/play', audioController.registerPlay);

module.exports = router;
