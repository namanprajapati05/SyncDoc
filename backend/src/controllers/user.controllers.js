const { User } = require("../models/user");
const { hashPassword, comparePassword } = require("../utils/password");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
  const { name, email, password, avatar } = req.body;

   if (!name?.trim() || !email?.trim() || !password) {
    throw new ApiError(400, "name, email and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const newPassword = await hashPassword(password);

  const userData = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: newPassword,
    avatar,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        name: userData.name,
        email: userData.email,
      },
      "User registered successfully",
    ),
  );
};




const login = async (req, res) => {
  const { email, password } = req.body;

   if (!email?.trim() || !password) {
    throw new ApiError(400, "email and password are required");
  }


  const user = await User.findOne({ email:email.toLowerCase().trim() });

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
};



const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
};



const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new ApiError(401, "Refresh token is required");
  }

   let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

   if (user.refreshToken !== token) {
    throw new ApiError(401, "Refresh token does not match or has been revoked");
  }

   const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });


    res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
      },
      "Access token refreshed successfully",
    ),
  );
};

module.exports = {
  signup,
  login,
  logout,
  refreshToken,
};