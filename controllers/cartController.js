const asyncHandler = require("express-async-handler");
const UserModel = require("../src/models/userModel");

// Lấy danh sách sản phẩm trong giỏ hàng của người dùng
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await UserModel.findById(userId).populate("cart.productId");
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.status(200).json({
    message: "Cart retrieved successfully.",
    data: {
      cart: user.cart,
    },
  });
});

// Thêm một sản phẩm vào giỏ hàng
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { productId, quantity = 1, selectedColor, selectedSize } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required.");
  }

  const user = await UserModel.findById(userId).select("+cart");
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
  const cartItem = user.cart.find(
    (item) =>
      item.productId === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
  );
  if (cartItem) {
    res.status(400);
    throw new Error("Product is already in cart. Update quantity instead.");
  }

  // Thêm sản phẩm vào giỏ hàng
  user.cart.push({
    productId,
    quantity,
    selectedColor,
    selectedSize,
    addedAt: new Date(),
  });
  await user.save({ validateModifiedOnly: true });

  res.status(201).json({
    message: "Product added to cart successfully.",
    data: {
      cart: user.cart,
    },
  });
});

// Cập nhật một sản phẩm trong giỏ hàng
const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { quantity, selectedColor, selectedSize } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  // Tìm sản phẩm trong giỏ hàng
  const cartItem = user.cart.find(
    (item) =>
      item.productId === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
  );
  if (!cartItem) {
    res.status(404);
    throw new Error("Product not found in cart.");
  }

  // Cập nhật các thuộc tính của sản phẩm
  if (quantity !== undefined) cartItem.quantity = quantity;
  if (selectedColor !== undefined) cartItem.selectedColor = selectedColor;
  if (selectedSize !== undefined) cartItem.selectedSize = selectedSize;

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    message: "Cart item updated successfully.",
    data: {
      cart: user.cart,
    },
  });
});

// Xóa một sản phẩm khỏi giỏ hàng của người dùng
const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { selectedColor, selectedSize } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const initialLength = user.cart.length;

  // Sử dụng filter để chỉ giữ lại các sản phẩm không khớp với productId, selectedColor, và selectedSize
  user.cart = user.cart.filter(
    (item) =>
      item.productId.toString() !== productId ||
      item.selectedColor !== selectedColor ||
      item.selectedSize !== selectedSize
  );

  // Kiểm tra xem có sản phẩm nào bị xóa hay không
  if (initialLength === user.cart.length) {
    res.status(404);
    throw new Error(
      "Product not found in cart with the specified color and size."
    );
  }

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    message: "Product removed from cart successfully.",
    data: {
      cart: user.cart,
    },
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
