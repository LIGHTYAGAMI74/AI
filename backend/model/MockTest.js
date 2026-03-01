const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }], 
  correctAnswer: { type: Number, required: true } // 0, 1, 2, or 3
});

const MockTestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, default: 20 }, // 20 Minutes
  questions: [QuestionSchema], 
  createdAt: { type: Date, default: Date.now },
  // Add this field
  level: { 
    type: String, 
    enum: ['6-8', '9-12', 'College'], 
    required: true 
  }
});

module.exports = mongoose.model('MockTest', MockTestSchema);