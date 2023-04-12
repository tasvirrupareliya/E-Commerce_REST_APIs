const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
      //product model class
    productName: {
      type: String,
    },
    description: {
      type: String,
    },
    shippingCost: {
      type: Number,
    },
    pricing: {
      type: Number,
    },
    images: {
      type: Array,
    },
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

let productModel = model("product", productSchema, "product");
module.exports = productModel;
