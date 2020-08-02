const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const FileList = mongoose.model("fileList", FileSchema, "fileList");
module.exports = FileList;
