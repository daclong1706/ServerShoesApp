const mongoose = require("mongoose");

const AddressItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Tên người nhận
  phone: { type: String, required: true, trim: true }, // Số điện thoại
  address: { type: String, required: true, trim: true }, // Địa chỉ
  street: { type: String, trim: true }, // Tên đường (có thể không có)
  isDefault: { type: Boolean, default: false }, // Đặt làm địa chỉ mặc định hay không
});

module.exports = mongoose.model("AddressItem", AddressItemSchema);
