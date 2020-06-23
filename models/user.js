const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
  },
  nickname: {
    type: String,
    trim: true,
    required: true,
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
});

const User = mongoose.model("user", UserSchema, "user");
module.exports = User;
