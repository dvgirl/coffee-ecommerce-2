const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { generateOtp, getOtpExpiryDate } = require("../services/otpService");
const { generateToken } = require("../services/tokenService");

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  phoneNumber: user.phoneNumber,
  isVerified: user.isVerified,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  addresses: Array.isArray(user.addresses)
    ? user.addresses.map((address) => ({
        id: address._id.toString(),
        label: address.label,
        name: address.name,
        phone: address.phone,
        address: address.address,
        apartment: address.apartment || "",
        company: address.company || "",
        city: address.city,
        state: address.state,
        country: address.country,
        zip: address.zip,
        isDefault: address.isDefault || false,
      }))
    : [],
});

const normalizePhoneNumber = (phoneNumber = "") => phoneNumber.replace(/\D/g, "");

const validateNameAndPhone = (name, phoneNumber) => {
  const trimmedName = String(name || "").trim();
  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  if (trimmedName.length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters long");
  }

  if (normalizedPhone.length !== 10) {
    throw new ApiError(400, "Phone number must be exactly 10 digits");
  }

  return {
    trimmedName,
    normalizedPhone,
  };
};

const requestOtp = asyncHandler(async (req, res) => {
  const { trimmedName, normalizedPhone } = validateNameAndPhone(
    req.body.name,
    req.body.phoneNumber
  );

  const otpCode = generateOtp();
  const otpExpiresAt = getOtpExpiryDate();

  let user = await User.findOne({ phoneNumber: normalizedPhone });

  if (!user) {
    user = await User.create({
      name: trimmedName,
      phoneNumber: normalizedPhone,
      otpCode,
      otpExpiresAt,
      isVerified: false,
    });
  } else {
    user.name = trimmedName;
    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "OTP generated successfully",
    data: {
      phoneNumber: user.phoneNumber,
      expiresAt: otpExpiresAt,
      ...(process.env.NODE_ENV !== "production" ? { otp: otpCode } : {}),
    },
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const normalizedPhone = normalizePhoneNumber(req.body.phoneNumber);
  const otp = String(req.body.otp || "").trim();
  const incomingName = String(req.body.name || "").trim();

  if (normalizedPhone.length !== 10) {
    throw new ApiError(400, "Phone number must be exactly 10 digits");
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new ApiError(400, "OTP must be a 6-digit number");
  }

  const user = await User.findOne({ phoneNumber: normalizedPhone });

  if (!user) {
    throw new ApiError(404, "User not found. Please request OTP first");
  }

  if (!user.otpCode || !user.otpExpiresAt) {
    throw new ApiError(400, "OTP not requested for this number");
  }

  if (user.otpExpiresAt.getTime() < Date.now()) {
    throw new ApiError(400, "OTP expired. Please request a new OTP");
  }

  if (user.otpCode !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (incomingName.length >= 2) {
    user.name = incomingName;
  }

  user.isVerified = true;
  user.lastLoginAt = new Date();
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = generateToken({
    userId: user._id.toString(),
    phoneNumber: user.phoneNumber,
  });

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    data: {
      token,
      user: sanitizeUser(user),
    },
  });
});

module.exports = {
  requestOtp,
  verifyOtp,
};
