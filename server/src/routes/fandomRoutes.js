const express = require('express');
const router = express.Router();
const fandomController = require('../controllers/fandomController');

const fandomHubController = require('../controllers/fandomHubController');
const { protect } = require('../middleware/auth');

// Public Explore Fandom Endpoint with Advanced Filters
router.get('/explore', fandomController.getExploreContent);

// Fandom Statistics by Category
router.get('/stats', fandomController.getFandomStats);

// Character Profiles Hub
router.get('/characters', fandomHubController.getCharacters);
router.get('/characters/:id', fandomHubController.getCharacterById);
router.patch('/characters/:id/like', fandomHubController.likeCharacter);

// Featured Articles & Lore Hub
router.get('/articles', fandomHubController.getArticles);
router.get('/articles/:id', fandomHubController.getArticleById);
router.post('/articles/submit', protect, fandomHubController.submitArticle);

module.exports = router;
