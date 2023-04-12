const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    text: {
      type: String,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
    ratting: {
      type: Number,
    },
    image: {
      type: String,
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

let commentModel = model("comment", commentSchema, "comment");
module.exports = commentModel;
