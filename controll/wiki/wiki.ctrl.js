const WikiModel = require("../../models/wiki");
const ContModel = require("../../models/contribution");
const UserModel = require("../../models/user");
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

    ContModel.find({ wiki_id: result._id }, (err, cont) => {
      UserModel.findById(cont[0].creator_id, (error, creator) => {
        res.render("wiki/index", {
          title,
          subtitle,
          data,
          created,
          nickname,
          accLevel,
          docLevel: result.level,
          creator,
        });
      });
    }).sort({ _id: -1 });
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

const deleteWiki = (req, res) => {
  const title = req.params.title;
  WikiModel.findOne({ title }, (err, result) => {
    if (req.session.accessLevel < result.level)
      return res.status(403).send("권한이 없습니다.");
    else {
      WikiModel.deleteOne({ title }, (error, _) => {
        if (error) return res.status(500).send("서버 에러입니다.");
        if (!result) return res.status(404).send("삭제할 문서가 없습니다.");
        return res.status(204).end();
      });
    }
  });
};

module.exports = { redirect, search, list, deleteWiki };
