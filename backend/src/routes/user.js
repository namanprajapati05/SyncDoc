const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../utils/asyncHandler");
const {
  signup,
  login,
  logout,
  refreshToken,
} = require("../controllers/user.controllers");




router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.get("/logout", asyncHandler(logout));
router.post("/refresh-token", asyncHandler(refreshToken));

module.exports = router;