const { Router } = require("express");
const router = Router();

router.use("/", require("./idxrou"));
router.use("/w", require("./wiki"));
router.use("/e", require("./edit"));

module.exports = router;
