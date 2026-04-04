const express = require("express");
const router = express.Router();

const {
  markTopicComplete,
  markChapterPractice,
  submitModuleTest,
  getMyProgress,
} = require("../controllers/progress");

const { authMiddleware } = require("../middleware/auth");

// 🔐 PROTECTED ROUTES
router.post("/topic-complete", authMiddleware, markTopicComplete);
router.post("/chapter-practice", authMiddleware, markChapterPractice);
router.post("/module-test", authMiddleware, submitModuleTest);

router.get("/me", authMiddleware, getMyProgress);

module.exports = router;