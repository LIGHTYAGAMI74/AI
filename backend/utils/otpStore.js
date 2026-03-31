// utils/otpStore.js

const otpStore = new Map();

exports.saveOtp = (email, otp) => {
  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 min
  });
};

exports.verifyOtp = (email, otp) => {
  const data = otpStore.get(email);

  if (!data) return false;
  if (Date.now() > data.expires) return false;

  return data.otp === otp;
};

exports.deleteOtp = (email) => {
  otpStore.delete(email);
};