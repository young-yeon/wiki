const WikiModel = require("../../models/wiki");
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

  WikiModel.findOne({ title: title }, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) {
      return res.render("edit/index", {
        title,
        subtitle: undefined,
        data: undefined,
      });
    }

    const subtitle = result.subtitle;
    const data = result.data;
    const nickname = req.session.nickname;
    res.render("edit/index", {
      title,
      subtitle,
      data,
      nickname,
    });
  });
};

const update = (req, res) => {
  const title = req.params.title;
  const data = req.body.data;
  const subtitle = req.body.subtitle;

  WikiModel.findOneAndUpdate(
    { title: title },
    { title, subtitle, data, created: Date.now() },
    (err, result) => {
      if (err) return res.status(500).end();
      if (!result) {
        WikiModel.create({ title, subtitle, data }, (err, _) => {
          if (err) return res.status(500).end();
        });
      }
      res.redirect("/w/" + querystring.escape(title));
    }
  );
};

module.exports = { redirect, edit, update };
