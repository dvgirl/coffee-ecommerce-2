const jwt = require("jsonwebtoken");

const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required");
  }

  const token = authHeader.replace("Bearer ", "").trim();

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "User not found for this token");
  }

  req.user = user;
  next();
});

module.exports = {
  protect,
};
