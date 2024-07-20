const express = require("express");
const {
  register,
  verifyOtp,
  requestLoginOtp,
  loginWithOtp,
  getProfileDetails,
  updateProfileDetails,
} = require("../controllers/auth.controller");
const { isAuth } = require("../utils/isAuth");

const router = express.Router();

router.post("/sign-up", register);

router.post("/verify-otp", verifyOtp);

router.post("/request-login-otp", requestLoginOtp);

router.post("/login-with-otp", loginWithOtp);

router.get("/profile", isAuth, getProfileDetails);

router.put("/profile", isAuth, updateProfileDetails);

module.exports = router;
