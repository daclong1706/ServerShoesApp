const mongoose = require("mongoose");
const AddressItem = require("./addressItemModel"); // Import AddressItemSchema

const AddressSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // ID khách hàng, liên kết với bảng User
  addresses: [AddressItem.schema], // Danh sách các địa chỉ của khách hàng
});

module.exports = mongoose.model("Address", AddressSchema);
