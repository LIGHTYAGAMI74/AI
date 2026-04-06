const axios = require("axios");

exports.verifyRecaptcha = async (token) => {
  if (!token) return { success: false };

  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    }
  );

  return response.data;
};