const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const message = require("../json/message.json");

// const user = {
//   email: "test@yopmail.com",
//   username: "test",
//   password: "test",
//   purchaseHistory: [],
//   shippingAddress: {
//     address: "test",
//     city: "test",
//     province: "test",
//     country: "test",
//     postalcode: "test",
//   },
//   isActive: true,
// };


//  //User model class

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    purchaseHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "order",
      },
    ],
    role: {
      type: String,
    },
    shippingAddress: {
      type: Object,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    console.log(
      "user.isModified(password)",
      user.isModified("password"),
      "user.isNew",
      user.isNew
    );
    if (user.isModified("password") || user.isNew) {
      this.password = await hash(user.password, 10);
      next();
    } else {
      next();
    }
  } catch (error) {
    console.log(message.passwordEncryptError, error);
  }
});

userSchema.set("toJSON", {
  transform: function (doc, ret, opt) {
    delete ret["password"];
    return ret;
  },
});

let userModel = model("user", userSchema, "user");
module.exports = userModel;
