const express = require("express");
const router = express.Router();
const ctrl = require("./edit.ctrl");

router.get("/", ctrl.redirect);
router.get("/:title", ctrl.edit);
router.post("/:title", ctrl.update);

module.exports = router;
