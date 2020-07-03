const express = require("express");
const router = express.Router();
const ctrl = require("./history.ctrl");

router.get("/", ctrl.historyPage);
router.get("/:id", ctrl.searchHistory);

module.exports = router;
