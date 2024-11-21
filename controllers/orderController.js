const asyncHandler = require("express-async-handler");
const OrderModel = require("../src/models/orderModel");
const UserModel = require("../src/models/userModel");

// Lấy danh sách đơn hàng của người dùng
const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await OrderModel.find({ customerId: userId });
  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error("No orders found.");
  }

  res.status(200).json({
    message: "Orders retrieved successfully.",
    data: {
      orders,
    },
  });
});

// Tạo một đơn hàng mới từ giỏ hàng
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  const user = await UserModel.findById(userId).select("+cart");
  if (!user || user.cart.length === 0) {
    res.status(400);
    throw new Error(
      "Cart is empty. Add items to cart before creating an order."
    );
  }

  // Tính tổng giá trị đơn hàng từ giỏ hàng
  const totalAmount = user.cart.reduce(
    (sum, item) => sum + item.quantity * item.productId.unitPrice,
    0
  );

  // Tạo đơn hàng
  const newOrder = new OrderModel({
    customerId: userId,
    orderDate: new Date(),
    items: user.cart.map((item) => ({
      productId: item.productId._id,
      productName: item.productId.name,
      quantity: item.quantity,
      unitPrice: item.productId.unitPrice,
      totalPrice: item.quantity * item.productId.unitPrice,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
    })),
    totalAmount,
    shippingAddress: req.body.shippingAddress, // Địa chỉ giao hàng từ body
    paymentDetails: req.body.paymentDetails, // Thông tin thanh toán từ body
    status: "Pending",
  });

  // Lưu đơn hàng và xóa giỏ hàng của người dùng
  await newOrder.save();
  user.cart = [];
  await user.save();

  res.status(201).json({
    message: "Order created successfully.",
    data: {
      order: newOrder,
    },
  });
});

// Lấy thông tin chi tiết đơn hàng
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const order = await OrderModel.findOne({ _id: orderId, customerId: userId });
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  res.status(200).json({
    message: "Order details retrieved successfully.",
    data: {
      order,
    },
  });
});

// Cập nhật trạng thái đơn hàng (chỉ dành cho admin hoặc người dùng nếu cần hủy)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status.");
  }

  const order = await OrderModel.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    message: "Order status updated successfully.",
    data: {
      order,
    },
  });
});

// Xóa đơn hàng (chỉ dành cho admin)
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  await order.remove();

  res.status(200).json({
    message: "Order deleted successfully.",
  });
});

module.exports = {
  getOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
