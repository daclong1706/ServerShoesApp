const asyncHandler = require("express-async-handler");
const UserModel = require("../src/models/userModel");
const bcrypt = require("bcrypt");

// Lấy thông tin người dùng
const getUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await UserModel.findById(userId).select("-password");
  console.log("hello");

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json({
    message: "User data retrieved successfully.",
    data: { user },
  });
});

// Cập nhật thông tin người dùng
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone, address } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Cập nhật các trường thông tin nếu có
  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.address = address || user.address;

  await user.save({ validateModifiedOnly: true });

  return res.status(200).json({
    message: "User information updated successfully.",
    data: { user },
  });
});

// Xóa tài khoản người dùng
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  await user.deleteOne();

  return res
    .status(200)
    .json({ message: "User account deleted successfully." });
});

// Lấy danh sách đơn hàng của người dùng
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await UserModel.findById(userId).populate("orders");

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json({
    message: "User orders retrieved successfully.",
    data: { orders: user.orders },
  });
});

// Cập nhật mật khẩu người dùng
const updatePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Kiểm tra mật khẩu hiện tại
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect." });
  }

  // Băm mật khẩu mới trước khi lưu
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.status(200).json({ message: "Password updated successfully." });
});

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  getUserOrders,
  updatePassword,
};
