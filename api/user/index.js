const router = require("express").Router();
const controller = require("./user.ctrl");

router.get("/list", controller.list);
router.post("/assign-admin/:username", controller.assignAdmin);

module.exports = router;
