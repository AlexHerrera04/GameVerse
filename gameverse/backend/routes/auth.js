const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, getPublicProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateProfile);
router.get('/profile/:username', getPublicProfile);

module.exports = router;
