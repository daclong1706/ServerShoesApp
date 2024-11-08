const Router = require("express");
const {
  getUser,
  updateUser,
  deleteUser,
  getUserOrders,
  updatePassword,
} = require("../../controllers/userController");
const { protect } = require("../../middlewares/authMiddleware");

const userRouter = Router();

// Lấy thông tin người dùng và cập nhật thông tin người dùng
userRouter
  .route("/")
  .get(protect, getUser) // GET - Lấy thông tin người dùng
  .put(protect, updateUser); // PUT - Cập nhật thông tin người dùng

// Xóa tài khoản người dùng
userRouter.route("/delete").delete(protect, deleteUser); // DELETE - Xóa tài khoản người dùng

// Cập nhật mật khẩu của người dùng
userRouter.route("/password").put(protect, updatePassword); // PUT - Cập nhật mật khẩu của người dùng

// Lấy danh sách đơn hàng của người dùng
userRouter.route("/orders").get(protect, getUserOrders); // GET - Lấy danh sách đơn hàng của người dùng

module.exports = userRouter;
