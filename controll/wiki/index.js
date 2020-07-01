const express = require("express");
const router = express.Router();
const ctrl = require("./wiki.ctrl");

router.get("/", ctrl.redirect);
router.get("/!list", ctrl.list);
router.delete("/:title", ctrl.deleteWiki)
router.get("/:title", ctrl.search);

module.exports = router;
