const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const auth = require('../middleware/auth.middleware');

router.post('/create', auth, testController.createTest);
router.get('/all', auth, testController.getTests);
router.post('/submit', auth, testController.submitTest);

module.exports = router;
