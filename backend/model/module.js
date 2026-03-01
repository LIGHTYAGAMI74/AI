const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  notionUrl: { type: String, required: true }, // The link to your public Notion page
  createdAt: { type: Date, default: Date.now },
  level: { 
    type: String, 
    enum: ['6-8', '9-12', 'College'], 
    required: true 
  } 
});

module.exports = mongoose.model('Module', ModuleSchema);