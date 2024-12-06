const mongoose = require("mongoose");
const { type } = require("os");

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
  }, // ID sản phẩm
  productName: { type: String, trim: true, required: true }, // Tên sản phẩm
  quantity: { type: Number, required: true, min: 1 }, // Số lượng sản phẩm (>= 1)
  unitPrice: { type: Number, required: true, min: 0 }, // Giá mỗi sản phẩm (>= 0)
  totalPrice: { type: Number, required: true, min: 0 }, // Tổng giá trị (>= 0)
  selectedColor: { type: String, trim: true }, // Màu sắc được chọn (mã hoặc tên màu)
  selectedSize: { type: String, trim: true }, // Kích thước được chọn (e.g., S, M, L)
});

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // ID khách hàng
  orderDate: { type: Date, default: Date.now }, // Ngày đặt hàng
  requiredDate: { type: Date }, // Ngày yêu cầu giao hàng
  shippedDate: { type: Date }, // Ngày giao hàng
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    required: true,
    default: "Pending", // Mặc định là "Pending"
  }, // Trạng thái đơn hàng
  items: [OrderItemSchema], // Danh sách sản phẩm trong đơn hàng
  totalAmount: { type: Number, required: true, min: 0 }, // Tổng giá trị đơn hàng
  shippingAddress: {
    method: {
      type: String,
      enum: ["Economy", "Normal", "Delivery", "Express"],
      required: true,
    },
    price: { type: Number, required: true },
    name: { type: String },
    phone: { type: String },
    street: { type: String },
    address: { type: String },
    // county: { type: String },
    // city: { type: String },
    // postalCode: { type: String },
    // country: { type: String },
  }, // Địa chỉ giao hàng
  paymentDetails: {
    method: {
      type: String,
      enum: ["Credit Card", "PayPal", "Cash", "Bank Transfer"],
      required: true,
    }, // Phương thức thanh toán
    status: {
      type: String,
      enum: ["Paid", "Unpaid", "Refunded"],
      required: true,
      default: "Unpaid", // Mặc định là "Unpaid"
    }, // Trạng thái thanh toán
    transactionId: { type: String, trim: true }, // Mã giao dịch
  },
});

module.exports = mongoose.model("Order", OrderSchema);
