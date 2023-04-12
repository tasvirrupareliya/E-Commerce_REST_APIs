const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
        //order model class
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "cart",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalShippingCost: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
    },
    invoiceNo: {
      type: String,
    },
    duedate: {
      type: Date,
      default: Date.now() + 3 * 24 * 60 * 60 * 1000,
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

let orderModel = model("order", orderSchema, "order");
module.exports = orderModel;
