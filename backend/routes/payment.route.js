const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const User = require('../model/user');
const auth = require('../middleware/auth');

// Use a function to get the Razorpay instance safely
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY KEYS ARE MISSING IN .ENV");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

router.post('/create-order', auth, async (req, res) => {
  try {
    // 1. Get instance only when needed
    const razorpay = getRazorpayInstance();

    const options = {
      amount: 149 * 100, // 14900 paise
      currency: "INR",
      receipt: `receipt_${req.user.id.substring(0, 5)}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    // Save orderId to user
    await User.findByIdAndUpdate(req.user.id, { razorpayOrderId: order.id });

    res.json(order);
  } catch (err) {
    console.error("RAZORPAY API ERROR:", err.message); 
    res.status(500).json({ error: err.message || "Failed to contact Razorpay" });
  }
});

// IMPORTANT: Add the Verify Payment route here too!
router.post('/verify-payment', auth, async (req, res) => {
  const crypto = require('crypto');
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await User.findByIdAndUpdate(req.user.id, { isPaid: true });
      res.json({ success: true, msg: "Payment Verified" });
    } else {
      res.status(400).json({ success: false, msg: "Invalid Signature" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;