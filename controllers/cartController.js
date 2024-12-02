const asyncHandler = require("express-async-handler");
const UserModel = require("../src/models/userModel");
const CartModel = require("../src/models/cartModel");

// // Lấy danh sách sản phẩm trong giỏ hàng của người dùng
// const getCart = asyncHandler(async (req, res) => {
//   const userId = req.user.id;

//   const user = await UserModel.findById(userId).populate("cart.productId");
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found.");
//   }

//   res.status(200).json({
//     message: "Cart retrieved successfully.",
//     data: {
//       cart: user.cart,
//     },
//   });
// });

// // Thêm một sản phẩm vào giỏ hàng
// const addToCart = asyncHandler(async (req, res) => {
//   const userId = req.user?.id;
//   const { productId, quantity = 1, selectedColor, selectedSize } = req.body;

//   if (!productId) {
//     res.status(400);
//     throw new Error("Product ID is required.");
//   }

//   const user = await UserModel.findById(userId).select("+cart");
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found.");
//   }

//   // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
//   const cartItem = user.cart.find(
//     (item) =>
//       item.productId === productId &&
//       item.selectedSize === selectedSize &&
//       item.selectedColor === selectedColor
//   );
//   if (cartItem) {
//     res.status(400);
//     throw new Error("Product is already in cart. Update quantity instead.");
//   }

//   // Thêm sản phẩm vào giỏ hàng
//   user.cart.push({
//     productId,
//     quantity,
//     selectedColor,
//     selectedSize,
//     addedAt: new Date(),
//   });
//   await user.save({ validateModifiedOnly: true });

//   res.status(201).json({
//     message: "Product added to cart successfully.",
//     data: {
//       cart: user.cart,
//     },
//   });
// });

// // Cập nhật một sản phẩm trong giỏ hàng
// const updateCartItem = asyncHandler(async (req, res) => {
//   const userId = req.user.id;
//   const { productId } = req.params;
//   const { quantity, selectedColor, selectedSize } = req.body;

//   const user = await UserModel.findById(userId);
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found.");
//   }

//   // Tìm sản phẩm trong giỏ hàng
//   const cartItem = user.cart.find(
//     (item) =>
//       item.productId === productId &&
//       item.selectedSize === selectedSize &&
//       item.selectedColor === selectedColor
//   );
//   if (!cartItem) {
//     res.status(404);
//     throw new Error("Product not found in cart.");
//   }

//   // Cập nhật các thuộc tính của sản phẩm
//   if (quantity !== undefined) cartItem.quantity = quantity;
//   if (selectedColor !== undefined) cartItem.selectedColor = selectedColor;
//   if (selectedSize !== undefined) cartItem.selectedSize = selectedSize;

//   await user.save({ validateModifiedOnly: true });

//   res.status(200).json({
//     message: "Cart item updated successfully.",
//     data: {
//       cart: user.cart,
//     },
//   });
// });

// // Xóa một sản phẩm khỏi giỏ hàng của người dùng
// const removeCartItem = asyncHandler(async (req, res) => {
//   const userId = req.user.id;
//   const { productId } = req.params;
//   const { selectedColor, selectedSize } = req.body;

//   const user = await UserModel.findById(userId);
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found.");
//   }

//   const initialLength = user.cart.length;

//   // Sử dụng filter để chỉ giữ lại các sản phẩm không khớp với productId, selectedColor, và selectedSize
//   user.cart = user.cart.filter(
//     (item) =>
//       item.productId.toString() !== productId ||
//       item.selectedColor !== selectedColor ||
//       item.selectedSize !== selectedSize
//   );

//   // Kiểm tra xem có sản phẩm nào bị xóa hay không
//   if (initialLength === user.cart.length) {
//     res.status(404);
//     throw new Error(
//       "Product not found in cart with the specified color and size."
//     );
//   }

//   await user.save({ validateModifiedOnly: true });

//   res.status(200).json({
//     message: "Product removed from cart successfully.",
//     data: {
//       cart: user.cart,
//     },
//   });
// });

// Lấy giỏ hàng của người dùng
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cart = await CartModel.findOne({ customerId: userId }).populate(
    "items.productId"
  );

  if (!cart) {
    cart = new CartModel({
      customerId: userId,
      items: [],
      totalAmount: 0,
    });

    await cart.save();
  }

  res.status(200).json({
    message: "Cart retrieved successfully.",
    data: {
      cart,
    },
  });
});

// Thêm một sản phẩm vào giỏ hàng
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1, selectedColor, selectedSize } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required.");
  }

  // Lấy giỏ hàng của người dùng
  let cart = await CartModel.findOne({ customerId: userId });

  if (!cart) {
    // Nếu giỏ hàng chưa tồn tại, tạo mới
    cart = new CartModel({
      customerId: userId,
      items: [],
      totalAmount: 0,
    });
  }

  // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
  );

  if (existingItem) {
    res.status(400);
    throw new Error("Product is already in cart. Update quantity instead.");
  }

  // Thêm sản phẩm vào giỏ hàng
  const newItem = {
    productId,
    productName: req.body.productName || "Unknown Product", // Lấy tên sản phẩm từ request nếu có
    quantity,
    unitPrice: req.body.unitPrice || 0, // Lấy giá từ request nếu có
    totalPrice: quantity * (req.body.unitPrice || 0),
    selectedColor,
    selectedSize,
  };

  cart.items.push(newItem);
  cart.totalAmount += newItem.totalPrice;

  await cart.save();

  res.status(201).json({
    message: "Product added to cart successfully.",
    data: {
      cart,
    },
  });
});

// Cập nhật một sản phẩm trong giỏ hàng
const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { quantity, selectedColor, selectedSize } = req.body;

  const cart = await CartModel.findOne({ customerId: userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found.");
  }

  // Tìm sản phẩm trong giỏ hàng
  const cartItem = cart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
  );

  if (!cartItem) {
    res.status(404);
    throw new Error("Product not found in cart.");
  }

  // Cập nhật các thuộc tính của sản phẩm
  if (quantity !== undefined) {
    cart.totalAmount -= cartItem.totalPrice; // Trừ tổng giá trị cũ
    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * cartItem.unitPrice; // Tính lại tổng giá trị sản phẩm
    cart.totalAmount += cartItem.totalPrice; // Cộng tổng giá trị mới
  }

  await cart.save();

  res.status(200).json({
    message: "Cart item updated successfully.",
    data: {
      cart,
    },
  });
});

// Xóa một sản phẩm khỏi giỏ hàng của người dùng
const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { selectedColor, selectedSize } = req.body;

  const cart = await CartModel.findOne({ customerId: userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found.");
  }

  const initialLength = cart.items.length;

  // Lọc bỏ sản phẩm cần xóa
  cart.items = cart.items.filter(
    (item) =>
      item.productId.toString() !== productId ||
      item.selectedColor !== selectedColor ||
      item.selectedSize !== selectedSize
  );

  if (initialLength === cart.items.length) {
    res.status(404);
    throw new Error("Product not found in cart with the specified attributes.");
  }

  // Tính lại tổng giá trị giỏ hàng
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

  await cart.save();

  res.status(200).json({
    message: "Product removed from cart successfully.",
    data: {
      cart,
    },
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
