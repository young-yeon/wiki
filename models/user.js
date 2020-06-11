const mongoose = require("mongoose");
const crypto = require("crypto");
const Schema = mongoose.Schema;
require("dotenv").config();
const secret = process.env.SECRET || "secret-key";

const User = new Schema({
  username: String,
  password: String,
  admin: { type: Boolean, default: false },
});

User.statics.create = function (username, password) {
  const encrypted = crypto
    .createHmac("sha1", secret)
    .update(password)
    .digest("base64");

  const user = new this({
    username,
    password: encrypted,
  });

  // return the Promise
  return user.save();
};

User.statics.findOneByUsername = function (username) {
  return this.findOne({
    username,
  }).exec();
};

User.methods.verify = function (password) {
  const encrypted = crypto
    .createHmac("sha1", secret)
    .update(password)
    .digest("base64");

  return this.password === encrypted;
};

User.methods.assignAdmin = function () {
  this.admin = true;
  return this.save();
};

module.exports = mongoose.model("user", User, "user");
