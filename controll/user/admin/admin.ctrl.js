const WikiModel = require("../../../models/wiki");
const UserModel = require("../../../models/user");

const adminPage = (req, res) => {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;

  res.render("user/admin/index", {
    nickname,
    accLevel,
  });
};

const userList = async (req, res) => {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  const page = req.query.page || 1;
  var users;

  try {
    users = await UserModel.find()
      .sort({ created: -1 })
      .skip((page - 1) * 10)
      .limit(10);
  } catch (err) {
    return res.status(500).end();
  }

  res.render("user/admin/user", { nickname, accLevel, users, page });
};

const userDetail = (req, res) => {
  const _id = req.params.id;
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  UserModel.findById(_id, (err, user) => {
    if (err) return res.status(500).end();
    if (!user)
      return res.status(404).render("error", {
        error: { status: 404 },
        message: "Not Found",
        nickname,
        accLevel,
      });
    else {
      res.render("user/admin/userDetail", {
        nickname,
        accLevel,
        user,
      });
    }
  });
};

const updateUser = (req, res) => {
  const _id = req.body._id;
  const accessLevel = req.body.accessLevel;
  const nickname = req.body.nickname;
  const email = req.body.email;

  if (!accessLevel || !nickname || !email) {
    return res.status();
  }
  const data = {
    email,
    nickname,
    accessLevel,
  };

  UserModel.findByIdAndUpdate(_id, data, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.status(404).end();
    else {
      res.redirect("/user/admin/user");
    }
  });
};

const wikiList = async (req, res) => {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  const page = req.query.page || 1;
  var wikis;

  try {
    wikis = await WikiModel.find()
      .sort({ created: -1 })
      .skip((page - 1) * 10)
      .limit(10);
  } catch (err) {
    return res.status(500).end();
  }

  res.render("user/admin/wiki", { nickname, accLevel, wikis, page });
};

const wikiDetail = (req, res) => {
  const _id = req.params.id;
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  WikiModel.findById(_id, (err, wiki) => {
    if (err) return res.status(500).end();
    if (!wiki)
      return res.status(404).render("error", {
        error: { status: 404 },
        message: "Not Found",
        nickname,
        accLevel,
      });
    else {
      res.render("user/admin/wikiDetail", {
        nickname,
        accLevel,
        wiki,
      });
    }
  });
};

const updateWiki = (req, res) => {
  const _id = req.body._id;
  const title = req.body.title;
  const subtitle = req.body.subtitle;
  const level = req.body.level;

  if (!title || !subtitle || !level) {
    return res.status();
  }
  const data = {
    title,
    subtitle,
    level,
  };

  WikiModel.findByIdAndUpdate(_id, data, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.status(404).end();
    else {
      res.redirect("/user/admin/wiki");
    }
  });
};

module.exports = {
  adminPage,
  userList,
  userDetail,
  updateUser,
  wikiList,
  wikiDetail,
  updateWiki,
};
