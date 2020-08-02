const express = require("express");
const router = express.Router();
const ctrl = require("./upload.ctrl");

router.get("/", ctrl.uploadPage);
router.post("/", ctrl.fileUpload);

module.exports = router;
