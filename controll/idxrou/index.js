var express = require("express");
var router = express.Router();
var ctrl = require("./index.ctrl");
require("dotenv").config();

router.get("/", ctrl.idx);
router.get("/random", ctrl.random);

module.exports = router;
