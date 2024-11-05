const Router = require("express");
const {
  createShoe,
  getShoes,
  getShoeById,
  updateShoe,
  deleteShoe,
} = require("../../controllers/shoesController");

const shoesRouter = Router();

// Endpoint để lấy tất cả giày hoặc thêm mới một sản phẩm giày
shoesRouter
  .route("/")
  .get(getShoes) // GET /api/shoes - Lấy tất cả sản phẩm giày
  .post(createShoe); // POST /api/shoes - Tạo mới một sản phẩm giày

// Endpoint để lấy một sản phẩm cụ thể, cập nhật hoặc xóa sản phẩm đó
shoesRouter
  .route("/:productId")
  .get(getShoeById) // GET /api/shoes/:productId - Lấy chi tiết sản phẩm giày theo ID
  .put(updateShoe) // PUT /api/shoes/:productId - Cập nhật sản phẩm giày theo ID
  .delete(deleteShoe); // DELETE /api/shoes/:productId - Xóa sản phẩm giày theo ID

module.exports = shoesRouter;
