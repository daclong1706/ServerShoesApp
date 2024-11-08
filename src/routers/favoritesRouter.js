const Router = require("express");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../../controllers/favoriteController");
const { protect } = require("../../middlewares/authMiddleware");

const favoritesRouter = Router();

favoritesRouter
  .route("/")
  .get(protect, getFavorites) // GET - Lấy tất cả sản phẩm yêu thích của người dùng
  .post(protect, addFavorite); // POST - Thêm một sản phẩm vào danh sách yêu thích

favoritesRouter.route("/:productId").delete(protect, removeFavorite); // DELETE - Xóa sản phẩm khỏi danh sách yêu thích

module.exports = favoritesRouter;
