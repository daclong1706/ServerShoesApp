const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    givenName: {
      type: String,
      trim: true,
    },
    familyName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    photo: {
      type: String,
      trim: true,
    },
    cart: [
      {
        productId: {
          type: String, // Sử dụng String thay vì ObjectId
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1, // Đảm bảo số lượng không ít hơn 1
        },
        selectedColor: {
          type: String,
          trim: true,
        },
        selectedSize: {
          type: String,
          trim: true,
        },
        addedAt: {
          type: Date,
          default: Date.now, // Thời gian thêm vào giỏ hàng
        },
      },
    ],
    favorites: [
      {
        productId: {
          type: String, // Sử dụng String thay vì ObjectId
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
