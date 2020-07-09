const express = require("express");
const router = express.Router();
const ctrl = require("./admin.ctrl");

router.get("/", ctrl.adminPage);
router.get("/user", ctrl.userList);
router.get("/user/:id", ctrl.userDetail);
router.post("/user/:id", ctrl.updateUser);
router.get("/wiki", ctrl.wikiList);
router.get("/wiki/:id", ctrl.wikiDetail);
router.post("/wiki/:id", ctrl.updateWiki);

module.exports = router;
