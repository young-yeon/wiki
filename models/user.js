const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    maxlength: 20,
    unique: true,
  },
  nickname: {
    type: String,
    trim: true,
    required: true,
    maxlength: 15,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  accessLevel: {
    type: Number,
    default: 1,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", UserSchema, "user");
module.exports = User;
