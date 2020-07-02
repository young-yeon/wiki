const mongoose = require("mongoose");

const ContSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
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
module.exports = Cert;
