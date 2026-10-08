const express = require("express");
const router = express.Router();


const { asyncHandler } = require("../utils/asyncHandler");
const {
  signup,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  searchUsers
} = require("../controllers/user.controllers");
const { authmiddleware } = require("../middleware/auth.middleware");


router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.get("/logout", asyncHandler(logout));
router.post("/refresh-token", asyncHandler(refreshToken));
router.get("/user", authmiddleware , asyncHandler(getCurrentUser));
router.get("/search", authmiddleware,asyncHandler(searchUsers));

module.exports = router;