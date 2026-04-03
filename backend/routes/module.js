const express = require("express");
const router = express.Router();

const { getModules, submitModuleTest } = require("../controllers/module");
const { authMiddleware } = require("../middleware/auth");

// 🔐 only logged-in users
router.get("/all", authMiddleware, getModules);
router.post("/test/submit", authMiddleware, submitModuleTest);


module.exports = router;