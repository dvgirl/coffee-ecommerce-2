const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const Address = require("../models/Address");

const sanitizeUser = (user, addressesCount = 0) => ({
  id: user._id,
  name: user.name,
  phoneNumber: user.phoneNumber,
  isVerified: user.isVerified,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  addressesCount,
});

const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const users = await User.find({})
    .select("-otpCode -otpExpiresAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await User.countDocuments();
  const addressCounts = await Address.aggregate([
    { $group: { _id: "$user", count: { $sum: 1 } } },
  ]);
  const addressCountMap = new Map(
    addressCounts.map((entry) => [String(entry._id), entry.count]),
  );

  res.status(200).json({
    success: true,
    data: {
      items: users.map((user) => sanitizeUser(user, addressCountMap.get(String(user._id)) || 0)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    },
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-otpCode -otpExpiresAt");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const addressesCount = await Address.countDocuments({ user: user._id });

  res.status(200).json({
    success: true,
    data: sanitizeUser(user, addressesCount),
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, phoneNumber, isVerified } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
  if (isVerified !== undefined) updateData.isVerified = isVerified;

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-otpCode -otpExpiresAt");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const addressesCount = await Address.countDocuments({ user: user._id });

  res.status(200).json({
    success: true,
    data: sanitizeUser(user, addressesCount),
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
