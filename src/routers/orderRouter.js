const Router = require("express");
const {
  getOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
} = require("../../controllers/orderController");
const { protect } = require("../../middlewares/authMiddleware");

const ordersRouter = Router();

// Route cho tất cả các đơn hàng
ordersRouter
  .route("/")
  .get(protect, getOrders) // GET - Lấy danh sách đơn hàng của người dùng
  .post(protect, createOrder); // POST - Tạo đơn hàng mới từ giỏ hàng

// Route cho một đơn hàng cụ thể
ordersRouter
  .route("/:orderId")
  .get(protect, getOrderById) // GET - Lấy thông tin chi tiết đơn hàng
  .patch(protect, updateOrderStatus); // PATCH - Cập nhật trạng thái đơn hàng

module.exports = ordersRouter;
