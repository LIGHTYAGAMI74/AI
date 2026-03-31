const Razorpay = require("razorpay");
const crypto = require("crypto");

const Payment = require("../models/payment");
const User = require("../models/user");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🧾 CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { amount, email } = req.body;
    const existing = await User.findOne({ email });

    if (existing.paymentStatus === "completed") {
    return res.status(400).json({ message: "Already paid" });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    await Payment.create({
      userEmail: email, // ✅ FIX
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
    });

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email
    } = req.body;

    // 🔥 SIGNATURE VERIFICATION (CRITICAL)
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // ✅ UPDATE PAYMENT RECORD
    await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "paid",
        userEmail: email,
      }
    );

    // ✅ UPDATE USER STATUS
    await User.updateOne(
      { email },
      { paymentStatus: "completed" }
    );

    res.json({ message: "Payment verified successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};