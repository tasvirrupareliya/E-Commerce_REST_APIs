const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  PRODUCT: { VALIDATOR, APIS },
} = require("../controllers");
const upload = require("../service/multer");

router.post(
  "/create",
  auth(),
  VALIDATOR.create,
  upload.array("files", 5),
  APIS.create
);

router.get("/get", APIS.getProduct);

router.put(
  "/update/:id",
  auth(),
  VALIDATOR.update,
  upload.array("files", 5),
  APIS.update
);

router.get("/get/:id", auth(), APIS.getProductBtId);

router.delete("/delete/:id", auth(), APIS.delete);

module.exports = router;
