const WikiModel = require("../../models/wiki");
const querystring = require("querystring");
const MarkdownIt = require("markdown-it"),
  md = new MarkdownIt();

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

  WikiModel.findOne({ title: title }, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.render("wiki/empty", { title });
    const subtitle = result.subtitle;
    const data = md.render(result.data);
    const created = result.created;

    res.render("wiki/index", {
      title,
      subtitle,
      data,
      created,
    });
  });
};

module.exports = { redirect, search };
