const ContModel = require("../../models/contribution");

const userPage = async (req, res) => {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  const creator_id = req.session._id;
  const contribution_count = await ContModel.count({creator_id})

  res.render("user/index", {
    creator_id,
    nickname,
    accLevel,
    contribution_count
  });
};

module.exports = { userPage };
