const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  CART: { VALIDATOR, APIS },
} = require("../controllers");

router.post("/add-product-to-cart", auth(), VALIDATOR.create, APIS.create);

router.get("/get", auth(), APIS.getCart);

router.put(
  "/update-product-to-cart/:id",
  auth(),
  VALIDATOR.updateOneProductBYCart,
  APIS.updateOneProductBYCart
);

router.delete(
  "/delete-product-to-cart/:id",
  auth(),
  APIS.deleteOneProductBYCart
);

module.exports = router;
