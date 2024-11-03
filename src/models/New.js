// src/models/New.js
const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  content: { type: String, required: true },
  author: { type: String, required: true },
  archiveDate: { type: Date },
});

module.exports = mongoose.model("New", newSchema);
