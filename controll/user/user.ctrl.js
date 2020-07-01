const UserModel = require("../../models/user");

const userPage = (req, res) => {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  res.render("user/index", {
    nickname,
    accLevel,
  });
};

module.exports = { userPage };
