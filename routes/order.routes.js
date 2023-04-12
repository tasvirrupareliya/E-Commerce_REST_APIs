const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  ORDER: { VALIDATOR, APIS },
} = require("../controllers");

router.post("/purchase", auth(), VALIDATOR.purchase, APIS.purchase);

router.get("/history", auth(), APIS.getOrderHistory);

module.exports = router;
