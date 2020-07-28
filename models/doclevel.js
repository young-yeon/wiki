const mongoose = require("mongoose");

const DocLevSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  wiki_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wiki",
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const DocLev = mongoose.model(
  "applyDocLevelUp",
  DocLevSchema,
  "applyDocLevelUp"
);
module.exports = DocLev;
