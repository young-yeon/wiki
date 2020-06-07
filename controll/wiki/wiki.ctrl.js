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
  res.setHeader("location", "/w/" + query);
  return res.end();
};

const random = (req, res) => {
  var sample = WikiModel.aggregate(
    [{ $sample: { size: 1 } }],
    (err, result) => {
      if (err) return res.status(500).end();
      if (!result) return res.status(404).end();
      console.log(result[0].title);
      res.status(301).setHeader("location", "/w/" + result[0].title);
      return res.end();
    }
  ).sample(1);
};

const search = (req, res) => {
  const title = req.params.title;

  WikiModel.find({ title: title }, (err, result) => {
    if (err) return res.status(500).end();
    if (!result.length) return res.render("wiki/empty", { title: title });
    const subtitle = result[0].subtitle;
    const data = result[0].data;
    const created = result[0].created;
    console.log(result);
    res.render("wiki/index", {
      title: title,
      subtitle: subtitle,
      data: data,
      created: created,
    });
  });
};

module.exports = { redirect, search, random };
