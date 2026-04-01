const express = require("express");
const router = express.Router();

const { getModules } = require("../controllers/module");
const { authMiddleware } = require("../middleware/auth");

// 🔐 only logged-in users
router.get("/all", authMiddleware, getModules);

module.exports = router;