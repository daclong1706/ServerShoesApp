const asyncHandler = require("express-async-handler");
const OrderModel = require("../src/models/orderModel");
const CartModel = require("../src/models/cartModel");

// Lấy danh sách đơn hàng của người dùng
const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await OrderModel.find({ customerId: userId }).populate(
    "items.productId"
  );

  if (!orders || orders.length === 0) {
    res.status(404);
    throw new Error("No orders found for this user.");
  }

  res.status(200).json({
    message: "Orders retrieved successfully.",
    data: {
      orders,
    },
  });
});

// Tạo một đơn hàng mới
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress, paymentDetails } = req.body;

  // Lấy giỏ hàng của người dùng
  const cart = await CartModel.findOne({ customerId: userId });

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty.");
  }

  // Tạo một đơn hàng mới từ giỏ hàng
  const newOrder = new OrderModel({
    customerId: userId,
    items: cart.items,
    totalAmount: cart.totalAmount,
    shippingAddress,
    paymentDetails,
    status: "Pending", // Đặt trạng thái đơn hàng là Pending khi mới tạo
  });

  // Xóa giỏ hàng sau khi tạo đơn hàng
  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  await newOrder.save();

  res.status(201).json({
    message: "Order created successfully.",
    data: {
      order: newOrder,
    },
  });
});

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  const { status } = req.body;

  // Kiểm tra trạng thái hợp lệ
  const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status.");
  }

  const order = await OrderModel.findOne({ _id: orderId, customerId: userId });

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

// Lấy thông tin đơn hàng cụ thể
const getOrderDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  // Tìm đơn hàng với id và userId
  const order = await OrderModel.findOne({
    _id: orderId,
    customerId: userId,
  }).populate("items.productId");

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

// Hủy đơn hàng
const cancelOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  const order = await OrderModel.findOne({ _id: orderId, customerId: userId });

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (order.status === "Cancelled") {
    res.status(400);
    throw new Error("Order is already cancelled.");
  }

  order.status = "Cancelled";
  await order.save();

  res.status(200).json({
    message: "Order cancelled successfully.",
    data: {
      order,
    },
  });
});

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  getOrderDetails,
  cancelOrder,
};
