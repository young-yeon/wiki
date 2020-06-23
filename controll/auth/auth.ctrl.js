const UserModel = require("../../models/user");

const loginPage = (req, res) => {
  res.render("auth/index");
};

const login = (req, res) => {
  const body = req.body;
  UserModel.findOne(
    { email: body.user_id, password: body.user_pwd },
    (err, result) => {
      if (err) {
        return res.status(500).end();
      }
      if (result) {
        req.session.nickname = result.nickname;
        req.session.id = result._id;
        req.session.accessLevel = result.accessLevel;
        return res.send("success");
      }
      return res.status(400).send("fail");
    }
  );
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
  const password = req.body.user_pwd;

  UserModel.exists({ email }, (err, result) => {
    if (err) return res.status(500).send("fail");
    if (result) return res.send("already exists");
  });

  UserModel.create({ nickname, email, password }, (err, result) => {
    if (err) return res.status(500).send("fail");
    req.session._id = result._id;
    req.session.nickname = result.nickname;
    req.session.accessLevel = result.accessLevel;

    console.log(
      req.session._id + req.session.nickname + req.session.accessLevel
    );
    res.send("success");
  });
};

module.exports = { loginPage, login, logout, registerPage, register };
