const express = require("express");
const router = express.Router();
const ctrl = require("./history.ctrl");

router.get("/", ctrl.historyPage);
router.get("/:id", ctrl.searchHistory);
router.put("/:id", ctrl.updateDoc);
router.delete("/:id", ctrl.deleteHistory);
router.get("/w/:title", ctrl.docHistory);
router.get("/user/:nickname", ctrl.userHistory);

module.exports = router;
