const ContModel = require("../../models/contribution");

const userPage = (req, res) => {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  const creator_id = req.session._id;

  ContModel.find({ creator_id }, (err, cont) => {
    if (err) return res.status(500).end();
    res.render("user/index", {
      nickname,
      accLevel,
      cont,
    });
  })
    .sort({ _id: -1 })
    .limit(7);
};

module.exports = { userPage };
