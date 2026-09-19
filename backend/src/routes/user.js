const express = require("express");
const { hashPassword, comparePassword } = require("../utils/password");
const router = express.Router();
const { User } = require("../models/user");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const { authmiddleware } = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken");

//signup

router.post(
  "/signup",

  asyncHandler(async (req, res) => {
    const { name, email, password, avatar } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "Email already registered");
    }

    const newPassword = await hashPassword(password);

    const userData = new User({
      name,
      email,
      password: newPassword,
      avatar,
    });

    await userData.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, userData.name, "User registered successfully"),
      );
  }),
);

//login

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new ApiError(404, "User is not found");
    }

    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Password is wrong");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          accessToken,
        },
        "User login successful",
      ),
    );
  }),
);

router.get(
  "/logout",
  asyncHandler(async (req, res) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "user logged out successfully"));
  }),
);

router.post(
  "/refresh-token",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = generateAccessToken(user);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken,
        },
        "Access token refreshed successfully",
      ),
    );
  }),
);

module.exports = router;
