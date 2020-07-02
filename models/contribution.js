const mongoose = require("mongoose");

const ContSchema = new mongoose.Schema({
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  wiki_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wiki",
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Cont = mongoose.model("cont", ContSchema, "cont");
module.exports = Cont;
