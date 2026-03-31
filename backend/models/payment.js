const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },

  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,

  amount: Number,
  currency: String,

  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);