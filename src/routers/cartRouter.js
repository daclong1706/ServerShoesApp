const Router = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../../controllers/cartController");
const { protect } = require("../../middlewares/authMiddleware");

const cartRouter = Router();

cartRouter
  .route("/")
  .get(protect, getCart) // GET - Lấy tất cả sản phẩm trong giỏ hàng của người dùng
  .post(protect, addToCart); // POST - Thêm một sản phẩm vào giỏ hàng

cartRouter
  .route("/:productId")
  .patch(protect, updateCartItem) // PATCH - Cập nhật số lượng hoặc thuộc tính sản phẩm trong giỏ hàng
  .delete(protect, removeCartItem); // DELETE - Xóa sản phẩm khỏi giỏ hàng

module.exports = cartRouter;
