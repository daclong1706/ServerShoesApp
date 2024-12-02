const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
  },
  productName: { type: String, trim: true, required: true }, // Tên sản phẩm
  quantity: { type: Number, required: true, min: 1 }, // Số lượng sản phẩm (>= 1)
  unitPrice: { type: Number, required: true, min: 0 }, // Giá mỗi sản phẩm (>= 0)
  totalPrice: { type: Number, required: true, min: 0 }, // Tổng giá trị (>= 0)
  selectedColor: { type: String, trim: true }, // Màu sắc được chọn (mã hoặc tên màu)
  selectedSize: { type: String, trim: true }, // Kích thước được chọn (e.g., S, M, L)
});

const CartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // ID khách hàng
  items: [CartItemSchema], // Danh sách sản phẩm trong đơn hàng
  totalAmount: { type: Number, required: true, min: 0 }, // Tổng giá trị đơn hàng
});

module.exports = mongoose.model("Cart", CartSchema);
