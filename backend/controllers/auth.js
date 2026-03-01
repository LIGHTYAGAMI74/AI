const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
// controllers/authController.js

exports.register = async (req, res) => {
  try {
    // 1. ADD 'level' TO THIS DESTRUCTURING LINE
    const { name, email, password, role, level } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // 2. PASS 'level' TO THE NEW USER OBJECT
    user = new User({ 
      name, 
      email, 
      password, 
      role: role || 'student', 
      level // THIS WAS LIKELY MISSING
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error("Reg Error:", err.message);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    // Use a fallback secret if .env fails for any reason
    const secret = process.env.JWT_SECRET || 'dev_secret_123';

    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};
// get profile
exports.getProfile = async (req, res) => {
  try {
    // req.user comes from our middleware (we will build next)
    const user = await User.findById(req.user.id).select('-password'); 
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Add this to your existing exports in controllers/authController.js
exports.logActivity = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // If they haven't been active today, add to log
    if (!user.stats.activityLog.includes(today)) {
      user.stats.activityLog.push(today);
      user.stats.activityDays += 1;
      user.stats.lastActiveDate = new Date();
      await user.save();
      return res.json({ msg: "Activity logged for today!", stats: user.stats });
    }

    res.json({ msg: "Already logged for today", stats: user.stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};