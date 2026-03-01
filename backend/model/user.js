const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  
  // Updated Student Stats
  stats: {
    testHistory: [{ 
      testId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest' },
      testName: String, 
      score: Number, 
      date: { type: Date, default: Date.now } 
    }],
    activityLog: [{ type: String }], // Array of dates: ["2026-03-01", "2026-03-02"]
    activityDays: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now }
  },
  // Add this field
level: { 
  type: String, 
  enum: ['6-8', '9-12', 'College'], 
  required: true 
},
isPaid: { type: Boolean, default: false },
razorpayOrderId: { type: String },
});

module.exports = mongoose.model('User', UserSchema);