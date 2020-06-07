var express = require("express");
var router = express.Router();
var ctrl = require("./random.ctrl");

/* GET home page. */
router.get("/", ctrl.idx);
router.get("/random", ctrl.random);

module.exports = router;
