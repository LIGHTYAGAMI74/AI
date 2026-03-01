const express = require('express')
const router = express.Router()
const { register, login ,getProfile, logActivity} = require('../controllers/auth')
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', register)
router.post('/login', login)
router.get('/profile', authMiddleware, getProfile);
router.post('/log-activity', authMiddleware, logActivity);

module.exports = router