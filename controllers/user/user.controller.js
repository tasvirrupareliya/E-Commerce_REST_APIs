const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");
const DB = require("../../models");
const helper = require("../../utils/utils");
const EMAIL = require("../../service/mail.service");
const {
  USER_TYPE: { ADMIN },
} = require("../../json/enums.json");

module.exports = exports = {
  signIn: async (req, res) => {
    const user = await DB.USER.findOne({ email: req.body.email }).lean();
    if (!user)
      return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    const isPasswordMatch = await helper.comparePassword({
      password: req.body.password,
      hash: user.password,
    });
    if (!isPasswordMatch)
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.INVALID_PASSWORD,
      });

    const token = helper.generateToken({
      data: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
    delete user.password;
    return apiResponse.OK({
      res,
      message: messages.SUCCESS,
      data: {
        user,
        token,
      },
    });
  },

  signUp: async (req, res) => {
    if (await DB.USER.findOne({ email: req.body.email }))
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.EMAIL_ALREADY_EXISTS,
      });

    await DB.USER.create(req.body);
    exports.signIn(req, res);
  },

  forgot: async (req, res) => {
    const isUserExists = await DB.USER.findOne({
      email: req.body.email,
      isActive: true,
    }).lean();
    if (!isUserExists)
      return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    const otp = await EMAIL.sendEmail({
      to: req.body.email,
      username: isUserExists.username,
    });
    await DB.OTP.findOneAndUpdate(
      { email: req.body.email },
      { otp: otp },
      { upsert: true, new: true }
    );
    return apiResponse.OK({ res, message: messages.SUCCESS });
  },

  verifyOtp: async (req, res) => {
    if (
      Date.now() >
      (await DB.OTP.findOne({ email: req.body.email, otp: req.body.otp })
        .expireAt)
    )
      return apiResponse.BAD_REQUEST({ res, message: messages.OTP_EXPIRED });

    const verify = await DB.OTP.findOneAndDelete({
      email: req.body.email,
      otp: req.body.otp,
    });
    if (!verify)
      return apiResponse.BAD_REQUEST({ res, message: messages.INVALID_CREDS });

    await DB.USER.findOneAndUpdate(
      { email: req.body.email },
      { password: await helper.hashPassword({ password: req.body.password }) }
    );
    return apiResponse.OK({ res, message: messages.SUCCESS });
  },

  changePassword: async (req, res) => {
    const user = await DB.USER.findById(req.user._id);
    if (!user)
      return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    if (
      !(await helper.comparePassword({
        password: req.body.oldPassword,
        hash: user.password,
      }))
    )
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.INVALID_PASSWORD,
      });

    await DB.USER.findByIdAndUpdate(req.user._id, {
      password: await helper.hashPassword({ password: req.body.newPassword }),
    });
    return apiResponse.OK({ res, message: messages.SUCCESS });
  },

  update: async (req, res) => {
    const user = await DB.USER.findById(req.params._id);
    if (!user)
      return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    if (await DB.USER.findOne({ email: req.body.email }))
      return apiResponse.DUPLICATE_VALUE({
        res,
        message: messages.EMAIL_ALREADY_EXISTS,
      });
    let data = await DB.USER.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
    });
    return apiResponse.OK({ res, message: messages.SUCCESS, data });
  },

  getUser: async (req, res) => {
    let { page, limit, sortBy, sortOrder, search, ...query } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortBy = sortBy || "createdAt";
    sortOrder = sortOrder || -1;

    query = { _id: req.user._id };
    search
      ? (query = {
          $or: [{ name: { $regex: search, $options: "i" } }],
        })
      : "";

    const data = await DB.USER.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .lean();

    return apiResponse.OK({
      res,
      message: messages.SUCCESS,
      count: await DB.USER.countDocuments(query),
      data,
    });
  },

  dashboardCounts: async (req, res) => {
    const data = {
      userCount: await DB.USER.countDocuments(),
      roleCount: await DB.ROLE.countDocuments(),
    };
    return apiResponse.OK({ res, message: messages.SUCCESS, data });
  },
};
