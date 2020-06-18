var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var controller = require("./controll");
var favicon = require("express-favicon");
require("dotenv").config();
const secret = process.env.SECRET || "secret-key";

var app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind("connection error:"));
db.once("open", () => console.log("Databse connected!"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("jwt-secret", secret);

app.use(logger("dev"));
app.use(express.json());
app.use(favicon(__dirname + "/public/favicon/favicon.ico"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", controller);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
