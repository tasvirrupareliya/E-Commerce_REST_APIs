const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const {
  USER_TYPE: { ADMIN },
} = require("../json/enums.json");

const {
  USER: { VALIDATOR, APIS },
} = require("../controllers");

router.post("/signup", VALIDATOR.signup, APIS.signUp);
router.post("/signin", VALIDATOR.signIn, APIS.signIn);
router.post("/forgot", VALIDATOR.forgot, APIS.forgot);
router.post("/verifyOtp", VALIDATOR.verifyOtp, APIS.verifyOtp);
router.post(
  "/changePassword",
  auth(),
  VALIDATOR.changePassword,
  APIS.changePassword
);

router.put("/update/:_id", auth(), VALIDATOR.update, APIS.update);

router.get("/get", auth(), VALIDATOR.fetch, APIS.getUser);
router.get("/dashboard", auth(), APIS.dashboardCounts);

module.exports = router;
