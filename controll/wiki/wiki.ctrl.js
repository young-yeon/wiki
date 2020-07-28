const WikiModel = require("../../models/wiki");
const ContModel = require("../../models/contribution");
const UserModel = require("../../models/user");
const DocLevModel = require("../../models/doclevel");
const querystring = require("querystring");
const xss = require("xss");
const marked = require("marked");
const moment = require("moment");

const redirect = (req, res, next) => {
  var query = req.query.q;
  query = query.trim();
  if (!query) {
    return res.redirect("/");
  }
  query = querystring.escape(query);
  try {
    if (query == "!history") return res.redirect("/history");
    else return res.redirect("/w/" + query);
  } catch (exception) {
    return res.redirect("/");
  }
};

async function search(req, res) {
  const title = req.params.title;
  if (title == "!history") return await res.redirect("/history");
  if (title.indexOf("!user:") == 0) {
    var username = title.slice(6).trim();
    return res.redirect("/user/" + username);
  }
  if (title == "!command") return res.redirect("/w/!명령어");

  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;

  WikiModel.findOne({ title: title }, async (err, result) => {
    if (err) return res.status(500).end();
    if (!result)
      return res.render("wiki/empty", {
        title,
        nickname,
        accLevel,
        docLevel: 1,
      });
    const subtitle = result.subtitle;
    const data = marked(xss(result.data));
    const created = result.created;

    const applyLevelUp = await DocLevModel.exists({
      applicant: req.session._id,
      wiki_id: result._id,
    });

    ContModel.find({ wiki_id: result._id }, (err, cont) => {
      UserModel.findById(cont[0].creator_id, (error, creator) => {
        if (err || error) return res.status(500).end();
        res.render("wiki/index", {
          title,
          subtitle,
          data,
          created,
          nickname,
          accLevel,
          docLevel: result.level,
          creator,
          moment,
          applyLevelUp,
        });
      });
    }).sort({ _id: -1 });
  });
}

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
        moment,
      });
  })
    .sort({ created: -1 })
    .skip((page - 1) * 10)
    .limit(10);
};

const deleteWiki = (req, res) => {
  const title = req.params.title;
  WikiModel.findOne({ title }, async (err, result) => {
    if (err) return res.status(500).end();
    if (req.session.accessLevel < result.level)
      return res.status(403).send("권한이 없습니다.");
    else {
      await ContModel.deleteMany({ wiki_id: result._id });
      WikiModel.deleteOne({ title }, (error, _) => {
        if (error) return res.status(500).send("서버 에러입니다.");
        if (!result) return res.status(404).send("삭제할 문서가 없습니다.");
        return res.status(204).end();
      });
    }
  });
};

const applyDocLevUp = async (req, res) => {
  const title = req.params.title;

  if (!req.session._id) return res.status(403).send("먼저 로그인을 해주세요.");

  const user = await UserModel.findById(req.session._id);
  const wiki = await WikiModel.findOne({ title });

  if (!user || !wiki)
    return res.status(404).send("사용자 또는 문서를 찾지 못했습니다.");
  DocLevModel.create(
    {
      applicant: user._id,
      wiki_id: wiki._id,
    },
    (err, result) => {
      if (err || !result) return res.status(500).send("서버 에러입니다.");
      return res.status(200).end();
    }
  );
};

module.exports = { redirect, search, list, deleteWiki, applyDocLevUp };
