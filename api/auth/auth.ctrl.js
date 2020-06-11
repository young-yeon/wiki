const UserModel = require("../../models/user");
const jwt = require("jsonwebtoken");

const register = (req, res) => {
  const { username, password } = req.body;
  let newUser = null;

  const create = (user) => {
    if (user) {
      return res.status(500).end();
    } else {
      return User.create(username, password);
    }
  };

  const count = (user) => {
    newUser = user;
    return User.count({}).exec();
  };

  const assign = (count) => {
    if (count === 1) {
      return newUser.assignAdmin();
    } else {
      return Promise.resolve(false);
    }
  };

  const respond = (isAdmin) => {
    res.json({
      message: "registered successfully",
      admin: isAdmin ? true : false,
    });
  };

  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  User.findOneByUsername(username)
    .then(create)
    .then(count)
    .then(assign)
    .then(respond)
    .catch(onError);
};

const login = (req, res) => {
  const { username, password } = req.body;
  const secret = req.app.get("jwt-secret");

  const check = (user) => {
    if (!user) {
      return res.status(500).end();
    } else {
      if (user.verify(password)) {
        const p = new Promise((resolve, reject) => {
          jwt.sign(
            {
              _id: user._id,
              username: user.username,
              admin: user.admin,
            },
            secret,
            {
              expiresIn: "10h",
              issuer: "gorae.ga",
              subject: "userInfo",
            },
            (error, token) => {
              if (error) reject(error);
              resolve(token);
            }
          );
        });
        return p;
      } else {
        return res.status(500).end();
      }
    }
  };

  const respond = (token) => {
    res.json({
      message: "logged in successfully",
      token,
    });
  };

  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  User.findOneByUsername(username).then(check).then(respond).catch(onError);
};

const check = (req, res) => {
  res.json({
    success: true,
    info: req.decoded,
  });
};

module.exports = { register, login, check };
