const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  ORDER: { VALIDATOR, APIS },
} = require("../controllers");

//order inserted
router.post("/purchase", auth(), VALIDATOR.purchase, APIS.purchase);

//get all order
router.get("/history", auth(), APIS.getOrderHistory);

module.exports = router;
