// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  studentPhone: String,
  parentPhone: String,
  parentEmail: String,

  level: String,
  school: String,
  city: String,
  state: String,
  board: String,

  role: { type: String, default: "student" },

  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },

  progress: {
    modules: [
      {
        moduleId: mongoose.Schema.Types.ObjectId,

        completed: { type: Boolean, default: false },
        unlocked: { type: Boolean, default: false },

        chapters: [
          {
            chapterId: String,

            topics: [
              {
                topicId: String,
                completed: { type: Boolean, default: false },
              }
            ],

            // 🔥 NEW
            topicCount: Number,
            topicsCompleted: { type: Number, default: 0 },

            chapterTestPassed: { type: Boolean, default: false },
            lastAttemptedAt: Date
          }
        ],

        moduleTestPassed: { type: Boolean, default: false }
      }
    ]
  },

  stats: {
    activityLog: {
      type: [String], // YYYY-MM-DD
      default: [],
    },
    activityDays: {
      type: Number,
      default: 0,
    },
    testHistory: {
      type: [
        {
          moduleId: mongoose.Schema.Types.ObjectId, // 🔥 IMPORTANT
          moduleTitle: String, // for UI (avoid extra queries)

          bestScore: Number, // 🔥 only best score stored
          attempts: { type: Number, default: 1 },

          lastScore: Number, // optional but useful
          lastAttemptedAt: Date,
        }
      ],
      default: [],
    },
  },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);