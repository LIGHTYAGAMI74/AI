// models/user.model.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  studentPhone: String,
  parentPhone: String,
  parentEmail: String,

  level: String,
  school: String,
  city: String,
  state: String,
  board: String,

  role: { type: String, default: "student" },

  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);