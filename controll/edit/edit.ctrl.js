const WikiModel = require("../../models/wiki");
const querystring = require("querystring");

const redirect = (req, res, next) => {
  var query = req.query.q;
  if (!query) {
    res.status(301).setHeader("location", "/");
    res.end();
  }
  query = querystring.escape(query);
  res.status(301);
  res.setHeader("location", "/e/" + query);
  return res.end();
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
    res.render("edit/index", { title, subtitle, data });
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
        WikiModel.create({ title, subtitle, data }, (err, res) => {
          if (err) return res.status(500).end();
        });
      }
      res.status(301).setHeader("location", "/w/" + title);
      res.end();
    }
  );
};

module.exports = { redirect, edit, update };
