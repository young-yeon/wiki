var express = require("express");
var router = express.Router();
var egg = require("./egg");

router.get("/andayo", egg.goraeganandayo);

module.exports = router;
