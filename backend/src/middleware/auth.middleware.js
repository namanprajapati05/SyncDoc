const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const { User } = require("../models/user");

const authmiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

 //  console.log("RAW AUTH HEADER:", JSON.stringify(authHeader));

  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    throw new ApiError(401, "Access Token is required");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  // decoded should contain whatever key you signed the token with — confirm this matches generateAccessToken
const user = await User.findById(decoded.userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid access token — user not found");
  }
  req.user = user;

  next();
});

module.exports = { authmiddleware };
