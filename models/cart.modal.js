const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    //cart model class
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let cartModel = model("cart", cartSchema, "cart");
module.exports = cartModel;
