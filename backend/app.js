// app.js
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");
const moduleRoutes = require("./routes/module.route");
const testRoutes = require("./routes/test.route");
const paymentRoutes = require("./routes/payment.route");

const app = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://Gridixaolympaid.vercel.app",
  "https://Gridixa-gridixa.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/module", moduleRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/payment", paymentRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

module.exports = app;