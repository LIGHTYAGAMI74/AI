// routes/auth.route.js

const express = require("express");
const router = express.Router();

const {
  sendRegisterOtp,
  verifyRegisterOtp,
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  checkUser,
  getProfile,
  logActivity
} = require("../controllers/auth");

const { authMiddleware } = require("../middleware/auth");

// routes/auth.route.js
router.get("/profile", authMiddleware, getProfile);
router.post("/log-activity", authMiddleware, logActivity);

// REGISTER FLOW
router.post("/send-register-otp", sendRegisterOtp);
router.post("/verify-register-otp", verifyRegisterOtp);
router.post("/register", register);

// CHECK USER
router.get("/check-user", checkUser);

// LOGIN
router.post("/login", login);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;