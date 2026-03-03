require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.route');
const moduleRoutes = require('./routes/module.route');
const testRoutes = require('./routes/test.route');
const paymentRoutes = require('./routes/payment.route');

const app = express();

// 1️⃣ Connect to Database
connectDB();

// 2️⃣ Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://benolympaid.vercel.app",
  "https://benolympaid-git-main-yourusername.vercel.app"
];

// 3️⃣ CORS Configuration (NO "*" used)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, etc.

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error(`CORS Blocked for origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// 4️⃣ Body Parser
app.use(express.json());

// 5️⃣ Routes
app.use('/api/auth', authRoutes);
app.use('/api/module', moduleRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/payment', paymentRoutes);

// 6️⃣ Health Check Route (VERY IMPORTANT for Render)
app.get('/', (req, res) => {
  res.status(200).json({ message: "Backend running successfully 🚀" });
});

// 7️⃣ Port Binding (Render Required)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});