const express = require("express");
const router = express.Router();
const ctrl = require("./wiki.ctrl");

router.get("/", ctrl.redirect);
router.get("/random", ctrl.random)
router.get("/:title", ctrl.search);

module.exports = router;
