const mongoose = require("mongoose");

const CertSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    maxlength: 20,
  },
  certNumber: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Cert = mongoose.model("cert", CertSchema, "cert");
module.exports = Cert;
