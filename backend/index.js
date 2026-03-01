require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.route');
const moduleRoutes = require('./routes/module.route');
const testRoutes = require('./routes/test.route');
const paymentRoutes = require('./routes/payment.route');

const app = express();

// 1. Connect to Database
connectDB();

// 2. Robust CORS Configuration
// This handles the "Preflight" OPTIONS request explicitly
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 3. Global Middleware
app.use(express.json());

// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api/module', moduleRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/payment', paymentRoutes);

// 5. Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});