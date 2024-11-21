const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  }, // ID khách hàng, tham chiếu đến collection Customer
  orderDate: { type: Date, default: Date.now }, // Ngày đặt hàng, mặc định là ngày hiện tại
  requiredDate: { type: Date }, // Ngày yêu cầu giao hàng
  shippedDate: { type: Date }, // Ngày vận chuyển
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    required: true,
  }, // Trạng thái đơn hàng
  items: [
    // Danh sách sản phẩm trong đơn hàng
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      }, // ID sản phẩm
      productName: { type: String, trim: true, required: true }, // Tên sản phẩm
      quantity: { type: Number, required: true, min: 1 }, // Số lượng (>= 1)
      unitPrice: { type: Number, required: true, min: 0 }, // Giá mỗi sản phẩm (>= 0)
      totalPrice: { type: Number, required: true, min: 0 }, // Thành tiền (>= 0)
    },
  ],
  totalAmount: { type: Number, required: true, min: 0 }, // Tổng giá trị đơn hàng (>= 0)
  shippingAddress: { type: Object, required: true }, // Địa chỉ giao hàng (tham chiếu đến AddressSchema hoặc cấu trúc tương tự)
  paymentDetails: {
    // Thông tin thanh toán
    method: {
      type: String,
      enum: ["Credit Card", "PayPal", "Cash", "Bank Transfer"],
      required: true,
    }, // Phương thức thanh toán
    status: {
      type: String,
      enum: ["Paid", "Unpaid", "Refunded"],
      required: true,
    }, // Trạng thái thanh toán
    transactionId: { type: String, trim: true }, // Mã giao dịch
  },
});

module.exports = mongoose.model("Order", OrderSchema);
