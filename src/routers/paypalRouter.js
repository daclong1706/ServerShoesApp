const Router = require("express");
const {
  createOrder,
  captureOrder,
  refundOrder,
} = require("../../controllers/paypalController");
const { protect } = require("../../middlewares/authMiddleware");

const paypalRouter = Router();

// Tạo đơn hàng PayPal
paypalRouter.post("/create-order", protect, createOrder);

// Xác nhận thanh toán PayPal
paypalRouter.post("/capture-order", protect, captureOrder);

// Hoàn tiền đơn hàng PayPal
paypalRouter.post("/refund-order", protect, refundOrder);

module.exports = paypalRouter;
