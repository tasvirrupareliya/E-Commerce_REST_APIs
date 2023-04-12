const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");

const {
  COMMENT: { VALIDATOR, APIS },
} = require("../controllers");
const upload = require("../service/multer");

router.post(
  "/create",
  auth(),
  VALIDATOR.create,
  upload.single("file"),
  APIS.create
);

router.delete("/delete/:id", auth(), APIS.delete);

module.exports = router;
