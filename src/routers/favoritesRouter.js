const Router = require("express");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../../controllers/favoriteController");
const { protect } = require("../../middlewares/authMiddleware");

const favoritesRouter = Router();

// Endpoint để lấy tất cả sản phẩm yêu thích của người dùng hoặc thêm mới một sản phẩm yêu thích
favoritesRouter
  .route("/")
  .get(protect, getFavorites) // GET /api/favorites - Lấy tất cả sản phẩm yêu thích của người dùng
  .post(protect, addFavorite); // POST /api/favorites - Thêm một sản phẩm vào danh sách yêu thích

// Endpoint để xóa một sản phẩm cụ thể khỏi danh sách yêu thích
favoritesRouter.route("/:productId").delete(protect, removeFavorite); // DELETE /api/favorites/:productId - Xóa sản phẩm khỏi danh sách yêu thích

module.exports = favoritesRouter;
