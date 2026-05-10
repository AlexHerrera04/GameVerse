const express = require('express');
const router = express.Router();
const { getPlatforms, getGames, getGameDetail, getUpcoming, getGenres } = require('../controllers/gamesController');

router.get('/platforms', getPlatforms);
router.get('/games', getGames);
router.get('/games/upcoming', getUpcoming);
router.get('/games/:id', getGameDetail);
router.get('/genres', getGenres);

module.exports = router;
