const UserModel = require("../../models/user");
const bcrypt = require("bcrypt-nodejs");

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
          req.session.id = result._id;
          req.session.accessLevel = result.accessLevel;
          return res.send("success");
        } else
          return res.status(404).send("이메일 또는 비밀번호가 틀렸습니다.");
      } catch (error) {
        return res.status(500).send("서버 에러입니다.");
      }
    }
    return res.status(404).send("이메일 또는 비밀번호가 틀렸습니다.");
  });
};

const logout = (req, res) => {
  delete req.session.nickname;
  delete req.session.id;
  delete req.session.accessLevel;
  res.send("success");
};

const registerPage = (req, res) => {
  res.render("auth/register");
};

const register = (req, res) => {
  const nickname = req.body.user_nickname;
  const email = req.body.user_id;

  UserModel.exists({ email }, (err, result) => {
    if (err) return res.status(500).send("계정 등록에 오류가 있습니다");
    if (result) return res.status(409).send("이미 존재하는 계정입니다.");
    else {
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(req.body.user_pwd, salt);

      UserModel.create({ nickname, email, password }, (err, result) => {
        if (err) return res.status(500).send("계정 등록에 오류가 있습니다.");
        req.session._id = result._id;
        req.session.nickname = result.nickname;
        req.session.accessLevel = result.accessLevel;

        res.status(201).send("success");
      });
    }
  });
};

module.exports = { loginPage, login, logout, registerPage, register };
