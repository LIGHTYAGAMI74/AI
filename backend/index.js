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

// 2. Allowed Origins
// Ensure these match your actual deployment URLs exactly
const allowedOrigins = [
  "http://localhost:3000",
  "https://benolympaid.vercel.app",
  "https://benolympaid-git-main-yourusername.vercel.app" // Add your Vercel preview URLs if needed
];

// 3. Robust CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like Postman or mobile apps)
    if (!origin) return callback(null, true);

    // 2. Check if origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked for origin: ${origin}`); // Logs the blocked origin to Render console
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// 4. Handle Preflight Requests Explicitly
app.options('*', cors());

// 5. Global Middleware
app.use(express.json());

// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/module', moduleRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/payment', paymentRoutes);

// 7. Port Binding for Render
// IMPORTANT: Render sets its own PORT. We MUST listen on "0.0.0.0"
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});