const { Router } = require("express");
const router = Router();

router.use("/", require("./idxrou"));
router.use("/w", require("./wiki"));
router.use("/e", require("./edit"));
router.use("/auth", require("./auth"));
router.use("/user", require("./user"));
router.use("/history", require("./history"));
router.use("/upload", require("./upload"));

module.exports = router;
