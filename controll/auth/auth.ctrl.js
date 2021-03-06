"use strict";
const CertModel = require("../../models/cert");
const UserModel = require("../../models/user");
const bcrypt = require("bcrypt-nodejs");
const nodemailer = require("nodemailer");

const loginPage = (req, res) => {
  res.render("auth/index");
};

const login = (req, res) => {
  const body = req.body;
  const password = body.user_pwd;
  UserModel.findOne({ email: body.user_id }, (err, result) => {
    if (err) {
      return res.status(500).end();
    }
    if (result) {
      try {
        if (bcrypt.compareSync(password, result.password)) {
          req.session.nickname = result.nickname;
          req.session._id = result._id;
          req.session.accessLevel = result.accessLevel;
          return res.status(200).end();
        } else
          return res.status(404).send("이메일 또는 비밀번호가 틀렸습니다.");
      } catch (error) {
        return res.status(500).send("서버 에러입니다.");
      }
    } else return res.status(404).send("이메일 또는 비밀번호가 틀렸습니다.");
  });
};

const logout = (req, res) => {
  delete req.session.nickname;
  delete req.session._id;
  delete req.session.accessLevel;
  res.send("success");
};

const registerPage = (req, res) => {
  res.render("auth/register");
};

const register = (req, res) => {
  const nickname = req.body.user_nickname;
  const email = req.body.user_id;
  const certNumber = req.body.certNumber;

  if (nickname.length > 15) {
    return res.status(403).send("닉네임의 길이는 최대 15자입니다.");
  } else {
    CertModel.exists({ email, certNumber }, (err, result) => {
      if (err) return res.status(500).send("서버 에러입니다.");
      if (!result) return res.status(403).send("잘못된 인증 번호입니다.");
      else {
        UserModel.exists({ email }, (err, result) => {
          if (err) return res.status(500).send("계정 등록에 오류가 있습니다");
          if (result) return res.status(409).send("이미 존재하는 계정입니다.");
          else {
            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(req.body.user_pwd, salt);

            UserModel.create({ nickname, email, password }, (err, result) => {
              if (err)
                return res.status(500).send("계정 등록에 오류가 있습니다.");
              req.session._id = result._id;
              req.session.nickname = result.nickname;
              req.session.accessLevel = result.accessLevel;

              res.status(201).end();
            });
          }
        });
      }
    });
  }
};

const forgotPassword = (req, res) => {
  res.render("auth/password");
};

const updatePassword = (req, res) => {
  const email = req.body.user_id;
  const certNumber = req.body.certNumber;

  CertModel.exists({ email, certNumber }, (err, result) => {
    if (err) return res.status(500).send("서버 에러입니다.");
    if (!result) return res.status(403).send("잘못된 인증 번호입니다.");
    else {
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(req.body.user_pwd, salt);

      UserModel.findOneAndUpdate(
        { email },
        { password },
        (err, updateResult) => {
          if (err) return res.status(500).send("계정 등록에 오류가 있습니다");
          if (!updateResult) return res.status(404).send("없는 계정입니다.");
          else return res.status(200).end();
        }
      );
    }
  });
};

async function sendMail(req, res) {
  const address = req.body.email;
  const certNumber = Math.floor(Math.random() * 10000);

  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
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
    CertModel.create({ email: address, certNumber }, (err, result) => {
      if (err || !result) return res.status(500).send("서버 에러입니다.");
      else return res.status(201).end();
    });
  }
}

const changeNickname = (req, res) => {
  res.render("auth/changeNickname");
};

const updateNickname = (req, res) => {
  const body = req.body;
  const nickname = body.user_nickname;
  const password = body.user_pwd;
  const email = body.user_id;
  if (nickname.length > 15) {
    return res.status(403).send("닉네임의 길이는 최대 15자입니다.");
  } else {
    UserModel.findOne({ email }, (err, result) => {
      if (err) {
        return res.status(500).end();
      }
      if (result) {
        try {
          if (bcrypt.compareSync(password, result.password)) {
            UserModel.findOneAndUpdate(
              { email },
              { nickname },
              (error, updateResult) => {
                if (error || !updateResult)
                  return res.status(500).send("서버 에러입니다.");
                else {
                  req.session.nickname = nickname;
                  req.session._id = result._id;
                  req.session.accessLevel = result.accessLevel;
                  return res.status(200).end();
                }
              }
            );
          } else
            return res.status(404).send("이메일 또는 비밀번호가 틀렸습니다.");
        } catch (error) {
          return res.status(500).send("서버 에러입니다.");
        }
      } else return res.status(404).send("이메일 또는 비밀번호가 틀렸습니다.");
    });
  }
};

const withdrawal = (req, res) => {
  const id = req.session._id;
  const password = req.body.passwd;
  UserModel.findById(id, (err, result) => {
    if (err) return res.status(500).send("서버 에러입니다.");
    if (!result) return res.status(500).send("계정을 찾을 수 없습니다.");
    else {
      if (bcrypt.compareSync(password, result.password)) {
        UserModel.findByIdAndDelete(id, (error, _) => {
          if (error) return res.status("서버 에러입니다.");
          else {
            delete req.session.nickname;
            delete req.session._id;
            delete req.session.accessLevel;
            return res.status(200).end();
          }
        });
      } else {
        return res.status(403).send("비밀번호가 틀렸습니다.");
      }
    }
  });
};

module.exports = {
  loginPage,
  login,
  logout,
  registerPage,
  register,
  forgotPassword,
  updatePassword,
  sendMail,
  changeNickname,
  updateNickname,
  withdrawal,
};
