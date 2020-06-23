const WikiModel = require("../../models/wiki");
const querystring = require("querystring");
var marked = require("marked");

const redirect = (req, res, next) => {
  var query = req.query.q;
  query = query.trim();
  if (!query) {
    res.redirect("/");
  }
  query = querystring.escape(query);
  try {
    res.redirect("/w/" + query);
  } catch (exception) {
    res.redirect("/");
  }
};

const search = (req, res) => {
  const title = req.params.title;
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;

  WikiModel.findOne({ title: title }, (err, result) => {
    if (err) return res.status(500).end();
    if (!result)
      return res.render("wiki/empty", {
        title,
        nickname,
        accLevel,
      });
    const subtitle = result.subtitle;
    const data = marked(result.data);
    const created = result.created;

    res.render("wiki/index", {
      title,
      subtitle,
      data,
      created,
      nickname,
      accLevel,
      docLevel: result.level,
    });
  });
};

module.exports = { redirect, search };
