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
        docLevel: 1,
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

const list = (req, res) => {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  const page = req.query.page || 1;

  WikiModel.find({}, (err, wikiList) => {
    if (err) return res.status(500).end();
    else
      return res.render("wiki/list", {
        title: "위키 문서 리스트",
        subtitle: "문서 제목을 클릭하면 이동합니다.",
        nickname,
        accLevel,
        wikiList,
        page,
      });
  })
    .sort({ created: -1 })
    .skip((page - 1) * 10)
    .limit(10);
};

module.exports = { redirect, search, list };
