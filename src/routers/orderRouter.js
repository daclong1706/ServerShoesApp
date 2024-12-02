const Router = require("express");
const {
  getOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderDetails, // Thêm import cho hàm lấy chi tiết đơn hàng
} = require("../../controllers/orderController");
const { protect } = require("../../middlewares/authMiddleware");

const orderRouter = Router();

orderRouter
  .route("/")
  .get(protect, getOrders) // GET - Lấy danh sách đơn hàng của người dùng
  .post(protect, createOrder); // POST - Tạo đơn hàng mới

orderRouter
  .route("/:orderId")
  .get(protect, getOrderDetails) // GET - Lấy chi tiết đơn hàng
  .patch(protect, updateOrderStatus) // PATCH - Cập nhật trạng thái đơn hàng
  .delete(protect, cancelOrder); // DELETE - Hủy đơn hàng

module.exports = orderRouter;
