const DB = require("../models");
const apiResponseponse = require("../utils/api.response");
const message = require("../json/message.json");
const jwt = require("jsonwebtoken");

module.exports = {
  auth: ({ isTokenRequired = true } = {}) => {
    return async (req, res, next) => {
      const token = req.header("x-auth-token");

      if (isTokenRequired && !token)
        return apiResponseponse.BAD_REQUEST({
          res,
          message: message.TOKEN_REQUIRED,
        });
      if (!isTokenRequired && !token) return next();

      let decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await DB.USER.findOne({
        _id: decoded._id,
        isActive: true,
      }).lean();
      if (!user) {
        return apiResponseponse.UNAUTHORIZED({
          res,
          message: message.INVALID_TOKEN,
        });
      } else {
        req.user = user;
        return next();
      }
    };
  },
};
