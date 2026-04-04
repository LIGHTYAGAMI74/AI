const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  saveOtp,
  verifyOtp: verifyOtpUtil,
  deleteOtp
} = require("../utils/otpStore");

// 🔥 GENERATE OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

//////////////////////////////////////////////////////////
// 🔐 REGISTER FLOW
//////////////////////////////////////////////////////////

exports.sendRegisterOtp = async (req, res) => {
  const { email } = req.body;

  const otp = generateOtp();
  await saveOtp(email, otp);

  res.json({ message: "OTP sent successfully" });
};

exports.verifyRegisterOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!verifyOtpUtil(email, otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  deleteOtp(email);
  res.json({ message: "OTP verified" });
};

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

//////////////////////////////////////////////////////////
// 🔐 LOGIN
//////////////////////////////////////////////////////////

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
// Get Profile
//////////////////////////////////////////////////////////

exports.getProfile = async (req, res) => {
  try {
    const user = await require("../models/user")
      .findById(req.user.id)
      .select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//////////////////////////////////////////////////////////
// Log Activity
//////////////////////////////////////////////////////////

exports.logActivity = async (req, res) => {
  try {
    const User = require("../models/user");

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const user = await User.findById(req.user.id);

    if (!user.stats.activityLog.includes(today)) {
      user.stats.activityLog.push(today);
      user.stats.activityDays = user.stats.activityLog.length;
      await user.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//////////////////////////////////////////////////////////
// 🔐 FORGOT PASSWORD FLOW
//////////////////////////////////////////////////////////

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const otp = generateOtp();
  await saveOtp(email, otp);

  res.json({ message: "OTP sent" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!verifyOtpUtil(email, otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.json({ message: "OTP verified" });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!verifyOtpUtil(email, otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.updateOne({ email }, { password: hashed });

  deleteOtp(email);

  res.json({ message: "Password updated" });
};

// GET /auth/check-user?email=
exports.checkUser = async (req, res) => {
  const user = await User.findOne({ email: req.query.email });

  if (user) return res.status(400).json({ exists: true });

  res.json({ exists: false });
};