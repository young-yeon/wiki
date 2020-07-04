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

  ContModel.findById(history_id, (err, result) => {
    if (!result)
      return res.render("error", {
        nickname,
        accLevel,
        error: { status: 404 },
        message: "해당 문서 기록을 찾을 수 없습니다.",
      });
    else {
      ContModel.findOne({ wiki_id: result.wiki_id }, async (error, wiki) => {
        if (err || error) return res.status(500).send("서버 에러입니다.");
        if (!wiki)
          return res.render("error", {
            nickname,
            accLevel,
            error: { status: 404 },
            message: "해당 문서 기록을 찾을 수 없습니다.",
          });
        else if (result._id.equals(wiki._id))
          return res.redirect(
            "/w/" + (await WikiModel.findById(result.wiki_id)).title
          );
        else {
          if (!mongoose.Types.ObjectId.isValid(history_id))
            return res.render("error", {
              nickname,
              accLevel,
              error: { status: 404 },
              message: "해당 문서 기록을 찾을 수 없습니다.",
            });
          else {
            const wiki = await WikiModel.findById(result.wiki_id);
            const user = await UserModel.findById(result.creator_id);
            const title = wiki.title;
            const subtitle = wiki.subtitle;
            const docLevel = wiki.level;
            result.data = marked(result.data);
            return res.render("history/index", {
              title,
              subtitle,
              nickname,
              accLevel,
              docLevel,
              result,
              user,
            });
          }
        }
      }).sort({ created: -1 });
    }
  });
};

const updateDoc = (req, res) => {
  const accLevel = req.session.accessLevel || -1;

  ContModel.findById(req.params.id, (err, result) => {
    WikiModel.findById(result.wiki_id, (error, wiki) => {
      if (err || error) return res.status(500).send("서버 에러입니다.");
      if (!wiki) return res.status(404).send("해당 문서를 찾을 수 없습니다.");
      else if (accLevel < wiki.level)
        return res
          .status(403)
          .send(
            "문서를 편집할 권한이 없습니다.\n" +
              '자세한 내용은 "문서작성등급제" 문서를 확인하세요\n' +
              "\n사용자 레벨: " +
              accLevel +
              "\n문서 레벨: " +
              wiki.level
          );
      else {
        WikiModel.findByIdAndUpdate(
          result.wiki_id,
          { data: result.data, created: Date.now() },
          (error, wiki) => {
            if (err || error) return res.status(500).end("서버 에러입니다.");
            if (!wiki)
              return res.status(404).send("없는 문서이거나 삭제된 문서입니다.");
            else {
              ContModel.create(result, (err, cont) => {
                if (err) return res.status(500).send("서버 에러입니다.");
                else return res.status(201).end();
              });
            }
          }
        );
      }
    });
  });
};

const deleteHistory = (req, res) => {
  const accLevel = req.session.accessLevel || -1;
  ContModel.findById(req.params.id, (err, cont) => {
    WikiModel.findById(cont.wiki_id, (error, wiki) => {
      if (err || error) return res.status(500).send("서버 에러입니다.");
      if (!cont || !wiki)
        return res.status(404).send("문서를 찾을 수 없습니다.");
      else if (accLevel < wiki.level)
        return res
          .status(403)
          .send(
            "해당 문서를 삭제할 권한이 없습니다.\n" +
              '자세한 내용은 "문서작성등급제" 문서를 확인하세요\n' +
              "\n사용자 레벨: " +
              accLevel +
              "\n문서 레벨: " +
              wiki.level
          );
      else {
        ContModel.findOne({ wiki_id: cont.wiki_id }, (err, checker) => {
          if (checker._id.equals(cont._id))
            return res
              .status(403)
              .send("각 문서의 최종 편집 기록은 삭제가 불가합니다.");
          else {
            ContModel.findByIdAndDelete(req.params.id, (err, result) => {
              if (err) return res.status(500).end();
              if (!result)
                return res.status(404).send("문서를 찾을 수 없습니다.");
              else return res.status(200).end();
            });
          }
        }).sort({ created: -1 });
      }
    });
  });
};

const docHistory = async (req, res) => {
  const title = req.params.title;
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  const page = req.query.page || 1;

  const wiki_id = (await WikiModel.findOne({ title }))._id;

  ContModel.find({ wiki_id }, (err, result) => {
    const wiki = result.map(async (elem) => {
      const wiki = await WikiModel.findById(elem.wiki_id);
      const user = await UserModel.findById(elem.creator_id);
      return { wiki, user, history: elem._id, created: elem.created };
    });
    Promise.all(wiki).then((wikiList) => {
      if (err) return res.status(500).end();
      else
        return res.render("history/list", {
          title,
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
};

module.exports = {
  historyPage,
  searchHistory,
  updateDoc,
  deleteHistory,
  docHistory,
};
