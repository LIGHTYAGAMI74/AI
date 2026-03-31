// utils/otpStore.js

const nodemailer = require("nodemailer");

const otpStore = new Map();

// 🔥 SMTP TRANSPORTER
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🎨 MODERN EMAIL TEMPLATE
const generateOtpEmail = (otp) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#fff9e6; padding:20px;">
    <div style="max-width:600px;margin:auto;background:white;border:4px solid black;padding:30px;">
      
      <h2 style="font-weight:900;text-transform:uppercase;margin-bottom:10px;">
        AI Olympiad Verification
      </h2>

      <p style="font-weight:bold;">
        Use the OTP below to complete your verification:
      </p>

      <div style="
        font-size:32px;
        font-weight:900;
        background:#000;
        color:#fff;
        padding:15px;
        text-align:center;
        margin:20px 0;
        letter-spacing:4px;
      ">
        ${otp}
      </div>

      <p style="font-size:12px;color:#555;">
        This OTP will expire in 5 minutes.
      </p>

      <hr style="margin:20px 0;" />

      <p style="font-size:12px;">
        If you didn’t request this, please ignore this email.
      </p>

      <p style="font-size:12px;font-weight:bold;">
        – Team Gridixa
      </p>

    </div>
  </div>
  `;
};

// 📩 SEND EMAIL FUNCTION
const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "🔐 Your AI Olympiad OTP Verification Code",
    html: generateOtpEmail(otp),
    replyTo: "no-reply@gridixa.in",
  });
};

// 💾 SAVE OTP + SEND EMAIL
exports.saveOtp = async (email, otp) => {
  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  });

  try {
    await sendOtpEmail(email, otp);
    console.log("✅ OTP sent to:", email);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw new Error("Failed to send OTP email");
  }
};

// ✅ VERIFY OTP
exports.verifyOtp = (email, otp) => {
  const data = otpStore.get(email);

  if (!data) return false;
  if (Date.now() > data.expires) return false;

  return String(data.otp) === String(otp);
};

// 🗑 DELETE OTP
exports.deleteOtp = (email) => {
  otpStore.delete(email);
};