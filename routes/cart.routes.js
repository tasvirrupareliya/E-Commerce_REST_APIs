const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  CART: { VALIDATOR, APIS },
} = require("../controllers");

router.post("/add-product-to-cart", auth(), VALIDATOR.create, APIS.create);


//for get cart details
router.get("/get", auth(), APIS.getCart);

//for update
router.put(
  "/update-product-to-cart/:id",
  auth(),
  VALIDATOR.updateOneProductBYCart,
  APIS.updateOneProductBYCart
);

//for delete

router.delete(
  "/delete-product-to-cart/:id",
  auth(),
  APIS.deleteOneProductBYCart
);

module.exports = router;
