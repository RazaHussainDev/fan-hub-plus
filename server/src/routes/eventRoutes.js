const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Location-Aware Event Discovery & Calendar Endpoints
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/:id/attend', eventController.attendEvent);

module.exports = router;
