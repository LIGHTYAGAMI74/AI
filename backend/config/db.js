const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // No extra options needed for modern Mongoose
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;