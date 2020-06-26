"use strict";
const nodemailer = require("nodemailer");
const CertModel = require("../../models/cert");
require("dotenv").config();

async function mail(req, res) {
  const address = req.body.email;
  const certNumber = Math.floor(Math.random() * 10000);

  let transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: process.env.SMTP_ID,
      pass: process.env.SMTP_PW,
    },
  });

  let info = await transporter.sendMail({
    from: '"고래위키" <' + process.env.EMAIL + ">",
    to: address,
    subject: "인증키",
    text: "아래 인증키를 입력해 주세요\n" + certNumber,
    html:
      "<h2>아래 인증키를 입력해주세요</h2><h1><b>" + certNumber + "</b></h1>",
  });

  if (!info) {
    return res.status(500).send("메일을 보내는데 문제가 있습니다.");
  } else {
    CertModel.create({ email, certNumber }, (err, result) => {
      if (err || !result) return res.status(500).send("서버 에러입니다.");
      else return res.status(201).end();
    });
  }
}

const mailChk = (req, res) => {
  const email = req.body.email;
  const certNumber = req.body.num;

  CertModel.exists({ email, certNumber }, (err, result) => {
    if (err) return res.status(500).send("서버 에러입니다.");
    if (!result) return res.status(403).send("잘못된 인증 번호입니다.");
    else return res.send("success");
  });
};

// mail("as608683@gmail.com", 1234).catch(console.error);

module.exports = { mail, mailChk };
