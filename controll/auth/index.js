const express = require("express");
const router = express.Router();
const ctrl = require("./auth.ctrl");
const mailCtrl = require("./mail.ctrl");
const { mail } = require("./mail.ctrl");

router.get("/login", ctrl.loginPage);
router.post("/login", ctrl.login);
router.get("/logout", ctrl.logout);
router.get("/register", ctrl.registerPage);
router.post("/register", ctrl.register);

router.post("/emailChk", mailCtrl.mail);
router.get("/emailChk", mailCtrl.mailChk);

module.exports = router;
