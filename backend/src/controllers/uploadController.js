const path = require("path");
const fs = require("fs");
const ApiError = require("../utils/ApiError");

const uploadProductImage = (req, res) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new ApiError(400, "At least one image file is required");
  }

  const urls = req.files.map((file) => {
    const fileName = file.filename;
    return `${req.protocol}://${req.get("host")}/uploads/products/${fileName}`;
  });

  res.status(201).json({
    success: true,
    data: {
      urls,
    },
  });
};

module.exports = {
  uploadProductImage,
};
