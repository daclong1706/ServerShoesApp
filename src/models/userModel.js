const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, trim: true },
});

const UserSchema = new mongoose.Schema(
  {
    // Tên và thông tin cá nhân
    name: { type: String, trim: true },
    givenName: { type: String, trim: true },
    familyName: { type: String, trim: true },

    // Thông tin đăng nhập
    email: { type: String, unique: true, trim: true, lowercase: true },
    password: { type: String },

    // Ngày sinh, số điện thoại, và giới tính
    birthDate: { type: Date },
    phoneNumber: { type: String, trim: true },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },

    // Ảnh đại diện
    photo: { type: String, trim: true },

    // Vai trò người dùng: admin, user, hoặc khách
    role: { type: String, enum: ["user", "admin", "guest"], default: "user" },

    // Trạng thái tài khoản
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }, // Đã xác minh email chưa

    // Địa chỉ
    address: [AddressSchema],

    // Giỏ hàng
    cart: [
      {
        productId: { type: String }, // Sử dụng String thay vì ObjectId
        quantity: { type: Number, default: 1, min: 1 },
        selectedColor: { type: String, trim: true },
        selectedSize: { type: String, trim: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],

    // Danh sách yêu thích
    favorites: [
      {
        productId: { type: String },
        addedAt: { type: Date, default: Date.now },
      },
    ],

    // Lịch sử mua hàng
    orders: [
      {
        orderId: { type: String },
        purchasedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ["pending", "completed", "canceled"] },
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
