const fileList = require("../../models/file");
const multer = require("multer");
const { Buffer } = require("buffer");
const moment = require("moment");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/uploads/");
  },
  filename: (req, file, callback) => {
    var fname = new Date().valueOf() + file.originalname;
    var extension = path.extname(file.originalname);
    callback(null, Buffer.from(fname).toString("base64") + extension);
  },
});

const fileFilter = (req, file, callback) => {
  var allowedMimes = ["image/gif", "image/jpeg", "image/pjpeg", "image/png"];
  if (allowedMimes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      {
        success: false,
        message: "파일 형식에 맞지 않습니다. (gif/jpg/png)",
      },
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

const fileUpload = (req, res) => {
  const user_id = req.session._id;
  if (!user_id) {
    res.status(403);
    res.send("권한이 없습니다. 먼저 로그인해주세요.");
  } else {
    upload(req, res, (error) => {
      if (error) {
        res.status(500);
        if (error.code == "LIMIT_FILE_SIZE") {
          error.message = "파일 크기가 너무 큽니다. (최대 5MB)";
          error.success = false;
        }
        return res.json(error);
      } else {
        if (!req.file) {
          res.status(500);
          res.send("파일을 찾을 수 없습니다.");
        } else {
          const filename = req.file.filename;
          const originalname = req.file.originalname;
          fileList.create({
            uploader: user_id,
            fileUrl: "/uploads/" + filename,
            fileName: originalname,
          });
          res.status(200);
          res.json({
            success: true,
            message: "파일이 성공적으로 업로드 되었습니다!",
            file: filename,
          });
        }
      }
    });
  }
};

const uploadPage = (req, res) => {
  const nickname = req.session.nickname;
  const accLevel = req.session.accessLevel || -1;
  const page = req.query.page || 1;

  fileList.find({}, (err, result) => {
    if (err) return res.status(500).end();
    return res.render("upload/index", {
      nickname,
      accLevel,
      page,
      moment,
      result,
    });
  });
};

module.exports = { fileUpload, uploadPage };
