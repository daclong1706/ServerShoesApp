const mongoose = require("mongoose");

// Schema cho màu sắc của sản phẩm
const ColorSchema = new mongoose.Schema({
  colorId: { type: String },
  colorName: { type: String },
  colorImage: { type: String }, // Ảnh đại diện cho màu sắc
  colorCode: { type: String }, // Mã màu (ví dụ: #FFFFFF)
  quantity: { type: Number }, // Số lượng tồn kho
  images: [String], // Danh sách URL hình ảnh cho màu sắc này
  discountPercentage: Number, // Phần trăm giảm giá riêng cho màu này
  country: [String], // Quốc gia sản xuất hoặc xuất xứ
});

// Schema cho tính năng của sản phẩm
const FeatureSchema = new mongoose.Schema({
  description: { type: String }, // Mô tả tính năng của sản phẩm
  image: { type: String }, // URL hình ảnh minh họa cho tính năng
});

// Schema cho đánh giá của người dùng
const ReviewSchema = new mongoose.Schema({
  username: { type: String }, // Tên người dùng đánh giá
  date: { type: String }, // Ngày đánh giá (có thể lưu dạng chuỗi)
  rating: { type: Number }, // Điểm đánh giá từ 1 đến 5
  comment: { type: String }, // Bình luận của người dùng
});

// Schema chính cho sản phẩm giày
const ShoesSchema = new mongoose.Schema(
  {
    productId: { type: String, unique: true }, // ID duy nhất của sản phẩm
    name: { type: String }, // Tên sản phẩm
    type: { type: String }, // Loại sản phẩm (giày thể thao, công sở, etc)
    brand: { type: String }, // Thương hiệu của sản phẩm
    price: { type: Number }, // Giá sản phẩm
    description: { type: String }, // Mô tả chi tiết về sản phẩm

    colors: [ColorSchema], // Danh sách các tùy chọn màu sắc của sản phẩm
    discountPercentage: Number, // Phần trăm giảm giá cho sản phẩm (nếu có)
    sizes: [String], // Danh sách kích thước có sẵn của sản phẩm (ví dụ: ["39", "40", "41"])
    features: [FeatureSchema], // Danh sách các tính năng của sản phẩm
    reviews: [ReviewSchema], // Danh sách các đánh giá của người dùng

    similarProductIds: [String], // Danh sách ID của sản phẩm tương tự
    benefits: [String], // Lợi ích của sản phẩm (ví dụ: ["Thoáng khí", "Chống trơn trượt"])
    productDetails: [String], // Các chi tiết khác của sản phẩm (ví dụ: ["Đế cao su", "Chất liệu da"])
    origins: String, // Thông tin nguồn gốc hoặc lịch sử của sản phẩm
    label: String, // Nhãn của sản phẩm (ví dụ: "Best Seller", "Exclusive")

    // Các trường meta (tự động thêm khi sử dụng `timestamps: true`)
  },
  { timestamps: true } // timestamps tự động thêm `createdAt` và `updatedAt`
);

// Tạo mô hình Shoes từ Schema
const ShoesModel = mongoose.model("Shoes", ShoesSchema);

module.exports = ShoesModel;
