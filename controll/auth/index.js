const express = require("express");
const router = express.Router();
const ctrl = require("./auth.ctrl");

router.get("/login", ctrl.loginPage);
router.post("/login", ctrl.login);
router.get("/logout", ctrl.logout);
router.get("/register", ctrl.registerPage);
router.post("/register", ctrl.register);

module.exports = router;
