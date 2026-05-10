const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite, rateGame } = require('../controllers/favoritesController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getFavorites);
router.post('/', authMiddleware, addFavorite);
router.delete('/:gameId', authMiddleware, removeFavorite);
router.patch('/:gameId/rating', authMiddleware, rateGame);

module.exports = router;
