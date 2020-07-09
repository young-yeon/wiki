const ContModel = require("../../models/contribution");
const UserModel = require("../../models/user");

const userPage = async (req, res) => {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  const creator_id = req.session._id;
  const contribution_count = await ContModel.count({ creator_id });

  res.render("user/index", {
    creator_id,
    nickname,
    accLevel,
    contribution_count,
  });
};

const userDetail = async (req, res) => {
  const nickname = req.session.nickname;
  const username = req.params.username;
  const accLevel = req.session.accessLevel || -1;
  const creator = await UserModel.findOne({ nickname: username });
  if (!creator) {
    return res.status(404).render("error", {
      error: { status: 404 },
      message: "User Notfound",
      nickname,
      accLevel,
    });
  } else {
    const creator_id = creator._id;
    const userLevel = creator.accessLevel;
    const userEmail = creator.email;
    const contribution_count = await ContModel.count({ creator_id });

    res.render("user/detail", {
      creator_id,
      userLevel,
      username,
      userEmail,
      nickname,
      accLevel,
      contribution_count,
    });
  }
};

const levelCheck = (req, res, next) => {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  if (accLevel != 3) {
    return res.status(403).render("error", {
      error: { status: 403 },
      message: "접근 권한이 없습니다.",
      nickname,
      accLevel,
    });
  } else next();
};

module.exports = { userPage, userDetail, levelCheck };
