const WikiModel = require("../../models/wiki");
const querystring = require("querystring");

const idx = function (req, res, next) {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  res.render("index", {
    title: "안녕, 고래!",
    nickname,
    accLevel,
  });
};

const random = (req, res) => {
  WikiModel.countDocuments().exec((err, count) => {
    var random = Math.floor(Math.random() * count);
    WikiModel.findOne()
      .skip(random)
      .exec((err, result) => {
        if (err) return res.status(500).end();
        res.status(301);
        res.setHeader("location", "/w/" + querystring.escape(result.title));
        res.setHeader("Cache-Control", "no-cache");
        return res.end();
      });
  });
};

module.exports = { idx, random };
