const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  title: String,
  contentUrl: String, // S3 markdown
  videoUrl: String,
});

const chapterSchema = new mongoose.Schema({
  title: String,
  topics: [topicSchema],
  practiceUrl: String, // md for 5Q
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,

  level: {
    type: String,
    enum: ["6-8", "9-10", "11-12"],
    required: true,
  },

  order: Number, // for sorting modules

  chapters: [chapterSchema],
}, { timestamps: true });

module.exports = mongoose.model("Module", moduleSchema);