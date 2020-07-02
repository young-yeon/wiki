const WikiModel = require("../../models/wiki");
// const ContModel = require("../../models/contribution")
const querystring = require("querystring");

const redirect = (req, res, next) => {
  var query = req.query.q;
  if (!query) {
    return res.redirect("/");
  }
  query = querystring.escape(query);
  return res.redirect("/e/" + query);
};

const edit = (req, res) => {
  const title = req.params.title;
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel;

  WikiModel.findOne({ title: title }, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) {
      return res.render("edit/index", {
        title,
        subtitle: undefined,
        data: undefined,
        nickname,
        accLevel,
      });
    }

    const subtitle = result.subtitle;
    const data = result.data;
    res.render("edit/index", {
      title,
      subtitle,
      data,
      nickname,
      accLevel,
      docLevel: result.level,
    });
  });
};

const update = (req, res) => {
  const title = req.params.title;
  const data = req.body.data;
  const subtitle = req.body.subtitle;
  const nickname = req.session.nickname;
  const level = req.session.accessLevel || -1;

  WikiModel.findOne({ title }, (err, result) => {
    if (!result) {
      if (level > 0) {
        WikiModel.create({ title, subtitle, data }, (err, _) => {
          if (err) return res.status(500).end();
          return res.redirect("/w/" + querystring.escape(title));
        });
      } else {
        return res.status(403).render("error", {
          error: { status: 403 },
          message: "접근 권한이 없습니다.",
          nickname,
          accLevel: level,
        });
      }
    } else if (result && level < result.level)
      return res.status(403).render("error", {
        error: { status: 403 },
        message: "접근 권한이 없습니다.",
        nickname,
        accLevel: level
      });
    else {
      
      WikiModel.findOneAndUpdate(
        { title },
        { title, subtitle, data, created: Date.now() },
        (err, result) => {
          if (err) return res.status(500).end();
          return res.redirect("/w/" + querystring.escape(title));
        }
      );
    }
  });
};

module.exports = { redirect, edit, update };
