const asyncHandler = require("express-async-handler");
const UserModel = require("../src/models/userModel");

// Lấy danh sách sản phẩm yêu thích của người dùng
const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Middleware bảo vệ đã thêm `req.user`

  const user = await UserModel.findById(userId).populate("favorites.productId");
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.status(200).json({
    message: "Favorite products retrieved successfully.",
    data: {
      favorites: user.favorites.map((fav) => ({
        productId: fav.productId,
      })),
    },
  });
});

const addFavorite = asyncHandler(async (req, res) => {
  const userId = req.user?.id; // Middleware để lấy thông tin user từ token
  const { productId } = req.body;

  // Kiểm tra nếu productId không được cung cấp
  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required.");
  }

  // Tìm người dùng
  const user = await UserModel.findById(userId).select("+favorites");
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Kiểm tra nếu sản phẩm đã có trong danh sách yêu thích
  const alreadyFavorite = user.favorites.some(
    (item) => item.productId === productId
  );

  if (alreadyFavorite) {
    res.status(400);
    throw new Error("Product is already in favorites.");
  }

  // Thêm sản phẩm vào danh sách yêu thích
  user.favorites.push({ productId, addedAt: new Date() });
  await user.save({ validateModifiedOnly: true }); // Chỉ validate những trường đã thay đổi

  console.log("Product added successfully:", user.favorites);

  res.status(201).json({
    message: "Product added to favorites successfully.",
    favorites: user.favorites,
  });
});

// Xóa một sản phẩm khỏi danh sách yêu thích của người dùng
const removeFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  // Không cần kiểm tra ObjectId vì productId là dạng String tự định nghĩa
  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const initialLength = user.favorites.length;
  user.favorites = user.favorites.filter(
    (item) => item.productId !== productId
  );

  if (initialLength === user.favorites.length) {
    res.status(404);
    throw new Error("Product not found in favorites.");
  }

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    message: "Product removed from favorites successfully.",
    favorites: user.favorites,
  });
});

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
