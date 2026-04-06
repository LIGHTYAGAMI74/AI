// config/env.js
require("dotenv").config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET", "SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RECAPTCHA_SECRET_KEY"];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
});

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
};