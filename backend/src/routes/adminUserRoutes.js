const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/adminUserController");

const router = express.Router();

// All admin routes require authentication
router.use(protect);

router.get("/", getAllUsers);
router.get("/:userId", getUserById);
router.patch("/:userId", updateUser);
router.delete("/:userId", deleteUser);

module.exports = router;