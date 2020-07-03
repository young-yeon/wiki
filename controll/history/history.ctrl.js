"use strict";
const WikiModel = require("../../models/wiki");
const ContModel = require("../../models/contribution");
const UserModel = require("../../models/user");
const mongoose = require("mongoose");
var marked = require("marked");

function historyPage(req, res) {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  const page = req.query.page || 1;

  ContModel.find({}, (err, result) => {
    const wiki = result.map(async function (elem) {
      const wiki = await WikiModel.findById(elem.wiki_id);
      const user = await UserModel.findById(elem.creator_id);
      return { wiki, user, history: elem._id, created: elem.created };
    });
    Promise.all(wiki).then((wikiList) => {
      if (err) return res.status(500).end();
      else
        return res.render("history/list", {
          title: "문서 변경 기록",
          subtitle: "문서 제목을 클릭하면 해당 시점으로 이동합니다.",
          nickname,
          accLevel,
          wikiList,
          page,
        });
    });
  })
    .sort({ created: -1 })
    .skip((page - 1) * 10)
    .limit(10);
}

const searchHistory = (req, res) => {
  const history_id = req.params.id;

  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;

  if (!mongoose.Types.ObjectId.isValid(history_id)) {
    return res.status(400).end();
  }

  ContModel.findById(history_id, async (err, result) => {
    const wiki = await WikiModel.findById(result.wiki_id);
    const user = await UserModel.findById(result.creator_id);
    const title = wiki.title;
    result.data = marked(result.data);

    if (err) return res.status(500).end();
    if (!result)
      return res.status(404).send("해당 문서 기록을 찾을 수 없습니다.");
    else {
      return res.render("history/index", {
        title,
        nickname,
        accLevel,
        result,
        user,
      });
    }
  });
};

module.exports = { historyPage, searchHistory };
