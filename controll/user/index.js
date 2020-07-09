const express = require("express");
const router = express.Router();
const ctrl = require("./user.ctrl");

router.get("/", ctrl.userPage);
router.use("/admin", ctrl.levelCheck, require("./admin"));
router.get("/:username", ctrl.userDetail);

module.exports = router;
