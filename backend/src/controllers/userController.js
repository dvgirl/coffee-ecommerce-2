const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

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

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: sanitizeUser(req.user),
  });
});

const validateAddressPayload = (payload = {}) => {
  const sanitized = {
    label: String(payload.label || "").trim() || "Home",
    name: String(payload.name || "").trim(),
    phone: String(payload.phone || "").trim(),
    address: String(payload.address || "").trim(),
    apartment: String(payload.apartment || "").trim(),
    company: String(payload.company || "").trim(),
    city: String(payload.city || "").trim(),
    state: String(payload.state || "").trim(),
    country: String(payload.country || "").trim(),
    zip: String(payload.zip || "").trim(),
    isDefault:
      payload.isDefault === true || String(payload.isDefault).toLowerCase() === "true",
  };

  if (!sanitized.name) {
    throw new ApiError(400, "Address name is required");
  }

  if (!/^[0-9]{10}$/.test(sanitized.phone)) {
    throw new ApiError(400, "Phone must be a 10-digit number");
  }

  if (!sanitized.address) {
    throw new ApiError(400, "Street address is required");
  }

  if (!sanitized.city) {
    throw new ApiError(400, "City is required");
  }

  if (!sanitized.state) {
    throw new ApiError(400, "State is required");
  }

  if (!sanitized.country) {
    throw new ApiError(400, "Country is required");
  }

  if (!/^[0-9]{4,10}$/.test(sanitized.zip)) {
    throw new ApiError(400, "Zip code must be valid");
  }

  return sanitized;
};

const refreshDefaultAddress = (user, defaultAddressId) => {
  user.addresses.forEach((address) => {
    address.isDefault = address._id.toString() === String(defaultAddressId);
  });
};

const listAddresses = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: sanitizeUser(req.user).addresses,
  });
});

const createAddress = asyncHandler(async (req, res) => {
  const user = req.user;
  const addressPayload = validateAddressPayload(req.body);

  if (!Array.isArray(user.addresses)) {
    user.addresses = [];
  }

  if (addressPayload.isDefault || user.addresses.length === 0) {
    refreshDefaultAddress(user, null);
    addressPayload.isDefault = true;
  }

  user.addresses.push(addressPayload);
  await user.save();

  res.status(201).json({
    success: true,
    data: sanitizeUser(user).addresses,
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const addressId = String(req.params.addressId || "").trim();
  const user = req.user;

  if (!addressId) {
    throw new ApiError(400, "Address id is required");
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  const addressPayload = validateAddressPayload(req.body);

  address.label = addressPayload.label;
  address.name = addressPayload.name;
  address.phone = addressPayload.phone;
  address.address = addressPayload.address;
  address.city = addressPayload.city;
  address.zip = addressPayload.zip;

  if (addressPayload.isDefault) {
    refreshDefaultAddress(user, addressId);
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: sanitizeUser(user).addresses,
  });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const addressId = String(req.params.addressId || "").trim();
  const user = req.user;

  if (!addressId) {
    throw new ApiError(400, "Address id is required");
  }

  const address = user.addresses.id(addressId);

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  address.remove();

  if (user.addresses.length > 0 && !user.addresses.some((addr) => addr.isDefault)) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: sanitizeUser(user).addresses,
  });
});

module.exports = {
  getCurrentUser,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
