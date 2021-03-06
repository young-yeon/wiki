const mongoose = require("mongoose");

const WikiSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  subtitle: {
    type: String,
    trim: true,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 1,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Wiki = mongoose.model("wiki", WikiSchema, "wiki");
module.exports = Wiki;
