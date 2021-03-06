var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var session = require("express-session");

var controller = require("./controll");
var favicon = require("express-favicon");
require("dotenv").config();

var app = express();

mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind("connection error:"));
db.once("open", () => console.log("Databse connected!"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(favicon(__dirname + "/public/favicon/favicon.ico"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use((_, res, next) => {
  res.setHeader("X-Powered-By", "Happstack");
  next();
});

app.use("/", controller);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  res.render("error", {
    nickname,
    accLevel,
  });
});

module.exports = app;
