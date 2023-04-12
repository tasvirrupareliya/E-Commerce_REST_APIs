const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");
const DB = require("../../models");
const ObjectId = require("mongoose");
const {
  USER_TYPE: { ADMIN },
} = require("../../json/enums.json");
module.exports = exports = {
  purchase: async (req, res) => {
    const { body } = req;
    const { _id } = req.user;
    if (!ObjectId.isValidObjectId(body.cartId)) {
      return apiResponse.BAD_REQUEST({
        res,
        message: messages.CART_ID_INVALID,
      });
    }
    try {
      const existCart = await DB.CART.findOne({
        userId: _id,
        isActive: true,
      }).populate("products.productId");
      if (existCart) {
        existCart.isActive = false;
console.log(" existCart.products", existCart.products)
        let totalPrice = existCart.products.reduce(
          (total, product) =>
            total + product?.productId?.pricing * product.quantity,
          0
        );
        let shippingCost = existCart.products.reduce(
          (total, product) => total + product?.productId?.shippingCost,
          0
        );

        let address = body.address || {};
        const userData = await DB.USER.findOne({ _id });
        if (!Object.keys(address).length) {
          address = userData.address;
        }
        const order = await DB.ORDER.create({
          userId: _id,
          cartId: existCart._id,
          totalPrice: totalPrice,
          totalShippingCost: shippingCost,
          address,
        });
        await existCart.save();
        let history = userData.purchaseHistory;
        history.push(order._id);
        userData.purchaseHistory = history;
        await userData.save();
        return apiResponse.OK({
          res,
          data: order,
          message: messages.ORDER_CREATED,
        });
      } else {
        return apiResponse.BAD_REQUEST({
          res,
          message: messages.CART_NOT_FOUND,
        });
      }
    } catch (error) {
      console.log(":::::::::::::::::::::::",error)
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
  getOrderHistory: async (req, res) => {
    const { _id, role } = req.user;
    let init = {};
    if (role !== ADMIN) {
      init = {
        userId: _id,
      };
    }
    try {
      const orders = await DB.ORDER.find(init)
        .populate({
          path: "cartId",
          populate: {
            path: "products.productId",
            model: "product",
            select: {
              _id: 1,
              productName: 1,
              pricing: 1,
              shippingCost: 1,
              images: 1,
              description: 1,
            },
          },
          select: {
            _id: 1,
          },
        })
        .populate("userId", {
          _id: 1,
          username: 1,
          email: 1,
        });
      return apiResponse.OK({ res, data: orders });
    } catch (error) {
      return apiResponse.CATCH_ERROR({ res, error });
    }
  },
};
