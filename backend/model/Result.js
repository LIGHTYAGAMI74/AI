const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  // We store the date as a string "YYYY-MM-DD" for easy GitHub-style tracking
  dateString: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);