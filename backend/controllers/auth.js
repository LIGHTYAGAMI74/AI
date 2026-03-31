// controllers/auth.controller.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { saveOtp, verifyOtp, deleteOtp } = require("../utils/otpStore");

// 🔥 GENERATE OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// 📩 SEND REGISTER OTP
exports.sendRegisterOtp = async (req, res) => {
  const { email } = req.body;

  const otp = generateOtp();
  saveOtp(email, otp);

  console.log("OTP:", otp); // replace with email service

  res.json({ message: "OTP sent successfully" });
};

// 🔢 VERIFY REGISTER OTP
exports.verifyRegisterOtp = async (req, res) => {
  const { email, otp } = req.body;

  const isValid = verifyOtp(email, otp);

  if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

  deleteOtp(email);

  res.json({ message: "OTP verified" });
};

// 📝 REGISTER USER (after OTP)
exports.register = async (req, res) => {
  try {
    const data = req.body;

    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashed,
      paymentStatus: "pending",
    });

    res.json({ message: "User created", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      email: user.email,
      role: user.role,
      paymentStatus: user.paymentStatus,
    },
  });
};

//////////////////////////////////////////////////////////
// 🔐 FORGOT PASSWORD FLOW
//////////////////////////////////////////////////////////

// SEND OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const otp = generateOtp();
  saveOtp(email, otp);

  console.log("RESET OTP:", otp);

  res.json({ message: "OTP sent" });
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!verifyOtp(email, otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.json({ message: "OTP verified" });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!verifyOtp(email, otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.updateOne({ email }, { password: hashed });

  deleteOtp(email);

  res.json({ message: "Password updated" });
};