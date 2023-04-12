const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");
const DB = require("../../models");
const {
  USER_TYPE: { ADMIN },
} = require("../../json/enums.json");
const ObjectId = require("mongoose");

module.exports = exports = {
  create: async (req, res) => {
    const { body } = req;
    const { files } = req;
    const { _id, role } = req.user;
    if (role !== ADMIN)
      return apiResponse.UNAUTHORIZED({
        res,
        message: messages.UNAUTHORIZED,
      });

    if (!files || !files.length)
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.PRODUCT_IMAGE_REQUIRED,
      });
    try {
      const product = await DB.PRODUCT.create({
        ...body,
        images: files.map((file) => file.path),
        userId: _id,
      });
      return apiResponse.OK({
        res,
        data: product,
        message: messages.PRODUCT_CREATED,
      });
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { files } = req;
    const { _id, role } = req.user;
    if (role !== ADMIN)
      return apiResponse.UNAUTHORIZED({
        res,
        message: messages.UNAUTHORIZED,
      });
    if (!id)
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.PRODUCT_ID_REQUIRED,
      });
    if (!ObjectId.isValidObjectId(id)) {
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.ID_INVALID,
      });
    }
    let payload = {
      ...body,
    };
    if (files && files.length) payload.images = files.map((file) => file.path);
    try {
      const product = await DB.PRODUCT.findOneAndUpdate(
        {
          _id: id,
          userId: _id,
        },
        {
          ...payload,
        },
        { new: true }
      );
      return apiResponse.OK({
        res,
        data: product,
        message: messages.PRODUCT_UPDATED,
      });
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },

  getProduct: async (req, res) => {
    try {
      const productsWithComment = await DB.PRODUCT.aggregate([
        {
          $lookup: {
            from: "comment",
            localField: "_id",
            foreignField: "productId",
            as: "comment",
            pipeline: [
              {
                $lookup: {
                  from: "user",
                  localField: "userId",
                  foreignField: "_id",
                  as: "userId",
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        email: 1,
                        username: 1,
                      },
                    },
                  ],
                },
              },
              {
                $unwind: {
                  path: "$userId",
                },
              },
              {
                $project: {
                  text: 1,
                  ratting: 1,
                  userId: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            productName: 1,
            description: 1,
            images: 1,
            price: 1,
            userId: 1,
            comment: 1,
            pricing: 1,
            shippingCost: 1,
            commentsCount: {
              $size: "$comment",
            },
            avgRating: {
              $avg: "$comment.ratting",
            },
          },
        },
      ]);
      return apiResponse.OK({
        res,
        data: productsWithComment,
        message: messages.PRODUCT_LIST,
      });
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
  getProductBtId: async (req, res) => {
    const { id } = req.params;
    if (!id)
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.PRODUCT_ID_REQUIRED,
      });
    if (!ObjectId.isValidObjectId(id)) {
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.ID_INVALID,
      });
    }
    try {
      const productsWithComment = await DB.PRODUCT.aggregate([
        {
          $match: {
            _id: ObjectId.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "comment",
            localField: "_id",
            foreignField: "productId",
            as: "comment",
            pipeline: [
              {
                $lookup: {
                  from: "user",
                  localField: "userId",
                  foreignField: "_id",
                  as: "userId",
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        email: 1,
                        username: 1,
                      },
                    },
                  ],
                },
              },
              {
                $unwind: {
                  path: "$userId",
                },
              },
              {
                $project: {
                  text: 1,
                  ratting: 1,
                  userId: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            productName: 1,
            description: 1,
            images: 1,
            price: 1,
            userId: 1,
            comment: 1,
            pricing: 1,
            shippingCost: 1,
            commentsCount: {
              $size: "$comment",
            },
            avgRating: {
              $avg: "$comment.ratting",
            },
          },
        },
      ]);
      return apiResponse.OK({
        res,
        data: productsWithComment,
        message: messages.PRODUCT_LIST,
      });
    } catch (error) {
      console.log(error);
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;
    const { role } = req.user;
    if (role !== ADMIN)
      return apiResponse.UNAUTHORIZED({
        res,
        message: messages.UNAUTHORIZED,
      });
    if (!id)
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.PRODUCT_ID_REQUIRED,
      });
    if (!ObjectId.isValidObjectId(id)) {
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.ID_INVALID,
      });
    }
    try {
      const product = await DB.PRODUCT.findOneAndDelete({
        _id: id,
        userId: req.user._id,
      });
      return apiResponse.OK({
        res,
        data: product,
        message: messages.PRODUCT_DELETED,
      });
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
};
