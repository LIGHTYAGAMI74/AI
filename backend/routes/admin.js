const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const { adminMiddleware } = require("../middleware/admin");

const {
  // MODULES
  getModules,
  createModule,
  updateChapterPracticeUrl,
  updateTopicContent,
  updateModuleTestUrl,

  // USERS
  getUsers,
  getUserAnalytics,
  getUserById,
  updateUser
} = require("../controllers/admin");

// 🔥 ALL ADMIN ROUTES PROTECTED
router.use(authMiddleware, adminMiddleware);

// ===== MODULES =====
router.get("/modules", getModules);
router.post("/modules", createModule);
router.put("/modules/:id/chapter", updateChapterPracticeUrl);
router.put("/modules/:id/topic", updateTopicContent);
router.put("/modules/:id/test", updateModuleTestUrl);

// ===== USERS =====
router.get("/users", getUsers);
router.get("/users/analytics", getUserAnalytics);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);

module.exports = router;