const express = require('express');
const router = express.Router();
const merchController = require('../controllers/merchController');

// Public Merchandise Showcase & Drops Endpoints
router.get('/', merchController.getMerchandise);
router.get('/:id', merchController.getMerchandiseById);
router.patch('/:id/like', merchController.likeMerchandise);

module.exports = router;
