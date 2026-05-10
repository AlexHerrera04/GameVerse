const express = require('express');
const router = express.Router();
const { getReviewsByGame, getAllReviews, createReview, updateReview, deleteReview, toggleLike, getMyReviews } = require('../controllers/reviewsController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getAllReviews);
router.get('/mine', authMiddleware, getMyReviews);
router.get('/game/:game_id', optionalAuth, getReviewsByGame);
router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);
router.post('/:id/like', authMiddleware, toggleLike);

module.exports = router;
