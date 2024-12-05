const Router = require("express");
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../../controllers/addressController");
const { protect } = require("../../middlewares/authMiddleware");

const addressRouter = Router();

// Lấy danh sách địa chỉ của người dùng và thêm địa chỉ mới
addressRouter
  .route("/")
  .get(protect, getAddresses) // GET - Lấy danh sách địa chỉ của người dùng
  .post(protect, addAddress); // POST - Thêm địa chỉ mới

// Cập nhật, xóa, và đặt địa chỉ mặc định
addressRouter
  .route("/:addressId")
  .put(protect, updateAddress) // PUT - Cập nhật thông tin địa chỉ
  .delete(protect, deleteAddress); // DELETE - Xóa địa chỉ

// Đặt một địa chỉ làm mặc định
addressRouter.route("/set-default/:addressId").put(protect, setDefaultAddress); // PUT - Đặt địa chỉ làm mặc định

module.exports = addressRouter;
