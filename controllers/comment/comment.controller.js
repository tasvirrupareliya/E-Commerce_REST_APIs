const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");
const DB = require("../../models");
const ObjectId = require("mongoose");

module.exports = exports = {
  create: async (req, res) => {
    const { body } = req;
    const { _id } = req.user;
    const { file } = req;
    if (!body?.productId && !body?.text) {
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.COMMENT_REQUIRED,
      });
    }
    if (body?.ratting && isNaN(body?.ratting)) {
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.RATTING_MUST_BE_NUMBER,
      });
    }
    try {
      const comment = await DB.COMMENT.create({
        ...body,
        image: file.path,
        userId: _id,
      });
      return apiResponse.OK({
        res,
        data: comment,
        message: messages.COMMENT_CREATED,
      });
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;
    if (!id)
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.COMMENT_ID_REQUIRED,
      });
    if (!ObjectId.isValidObjectId(id)) {
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.ID_INVALID,
      });
    }
    try {
      const comment = await DB.COMMENT.findByIdAndDelete(id);
      return apiResponse.OK({
        res,
        data: comment,
        message: messages.COMMENT_DELETED,
      });
    } catch (error) {
      return apiResponse.CATCH_ERROR({
        res,
        message: "Error in deleting comment",
        error,
      });
    }
  },
};
