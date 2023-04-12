const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");
const DB = require("../../models");
const ObjectId = require("mongoose");

module.exports = exports = {
  create: async (req, res) => {
    const { body } = req;
    const { _id } = req.user;
    if (!ObjectId.isValidObjectId(body.productId)) {
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.PRODUCT_ID_INVALID,
      });
    }
    try {
      const existCart = await DB.CART.findOne({
        userId: _id,
        isActive: true,
      });
      if (existCart) {
        const existProduct = existCart.products.find(
          (product) => product.productId == body.productId
        );
        if (existProduct) {
          existProduct.quantity += body.quantity;
        } else {
          existCart.products.push(body);
        }
        await existCart.save();
        return apiResponse.OK({
          res,
          data: existCart,
          message: messages.CART_UPDATED,
        });
      } else {
        const cart = await DB.CART.create({
          userId: _id,
          products: [body],
        });
        return apiResponse.OK({
          res,
          data: cart,
          message: messages.CART_CREATED,
        });
      }
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
  updateOneProductBYCart: async (req, res) => {
    const { body } = req;
    const { _id } = req.user;
    const { id } = req.params;
    if (!id)
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.PRODUCT_ID_REQUIRED,
      });
    if (!ObjectId.isValidObjectId(id)) {
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.PRODUCT_ID_INVALID,
      });
    }
    try {
      const cart = await DB.CART.findOne({
        userId: _id,
        isActive: true,
      });
      if (!cart) {
        return apiResponse.NOT_FOUND({
          res,
          message: messages.CART_NOT_FOUND,
        });
      }
      const existProduct = cart.products.find(
        (product) => product.productId == id
      );
      if (existProduct) {
        existProduct.quantity = body.quantity;
      }
      await cart.save();
      return apiResponse.OK({
        res,
        data: cart,
        message: messages.CART_UPDATED,
      });
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
  deleteOneProductBYCart: async (req, res) => {
    const { id } = req.params;
    const { _id } = req.user;
    if (!id)
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.PRODUCT_ID_REQUIRED,
      });
    if (!ObjectId.isValidObjectId(id)) {
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.PRODUCT_ID_INVALID,
      });
    }
    try {
      const cart = await DB.CART.findOne({
        userId: _id,
        isActive: true,
      });
      if (!cart) {
        return apiResponse.NOT_FOUND({
          res,
          message: messages.CART_NOT_FOUND,
        });
      }
      cart.products = cart.products.filter(
        (product) => product.productId != id
      );
      await cart.save();
      return apiResponse.OK({
        res,
        data: cart,
        message: messages.CART_UPDATED,
      });
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
  getCart: async (req, res) => {
    try {
      const { _id } = req.user;
      const cart = await DB.CART.aggregate([
        {
          $match: {
            userId: ObjectId.Types.ObjectId(_id),
            isActive: true,
          },
        },
        {
          $unwind: "$products",
        },
        {
          $lookup: {
            from: "product",
            localField: "products.productId",
            foreignField: "_id",
            as: "products.product",
          },
        },
        {
          $unwind: "$products.product",
        },
        {
          $group: {
            _id: "$_id",
            userId: { $first: "$userId" },
            products: {
              $push: {
                productId: "$products.productId",
                quantity: "$products.quantity",
                product: "$products.product",
              },
            },
            totalPrice: {
              $sum: {
                $multiply: ["$products.quantity", "$products.product.pricing"],
              },
            },
            totalShippingCost: {
              $sum: {
                $multiply: ["$products.product.shippingCost"],
              },
            },
          },
        },
      ]);
      return apiResponse.OK({
        res,
        data: cart,
        message: messages.CART_FOUND,
      });
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
};
