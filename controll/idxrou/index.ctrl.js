const WikiModel = require("../../models/wiki");
const querystring = require("querystring");

const idx = function (req, res, next) {
  res.render("index", { title: "Hello, Wiki!" });
};

const random = (req, res) => {
  WikiModel.countDocuments().exec((err, count) => {
    var random = Math.floor(Math.random() * count);
    WikiModel.findOne()
      .skip(random)
      .exec((err, result) => {
        if (err) return res.status(500).end();
        res.status(301);
        res.setHeader("location", "/w/" + result.title);
        res.setHeader("Cache-Control", "no-cache");
        return res.end();
      });
  });
};

module.exports = { idx, random };
