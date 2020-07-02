const express = require("express");
const router = express.Router();
const ctrl = require("./auth.ctrl");

router.get("/login", ctrl.loginPage);
router.post("/login", ctrl.login);
router.get("/logout", ctrl.logout);
router.get("/register", ctrl.registerPage);
router.post("/register", ctrl.register);
router.get("/forgot-password", ctrl.forgotPassword);
router.put("/forgot-password", ctrl.updatePassword);
router.get("/change-nickname", ctrl.changeNickname);
router.put("/change-nickname", ctrl.updateNickname);
router.delete("/withdrawal", ctrl.withdrawal);

router.post("/emailChk", ctrl.sendMail);

module.exports = router;
