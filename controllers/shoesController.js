const asyncHandler = require("express-async-handler");
const Shoes = require("../src/models/shoesModel");

// Tạo mới sản phẩm giày
const createShoe = async (req, res) => {
  try {
    const shoe = req.body;
    console.log("Request Body:", shoe); // Log request body để kiểm tra dữ liệu nhận được

    // Kiểm tra xem sản phẩm đã tồn tại chưa
    const existingShoe = await Shoes.findOne({ productId: shoe.productId });
    console.log("Existing Shoe:", existingShoe); // Log sản phẩm đã tồn tại (nếu có)
    if (existingShoe) {
      return res.status(400).json({ error: "Product already exists." });
    }

    // Tạo sản phẩm mới
    const newShoe = await Shoes.create(shoe);
    console.log("New Shoe Created:", newShoe); // Log sản phẩm mới được tạo
    return res.status(201).json(newShoe);
  } catch (error) {
    console.error("Error occurred while creating shoe:", error); // Log lỗi chi tiết
    return res
      .status(500)
      .json({ error: "Server error occurred while creating shoe." });
  }
};

// Lấy tất cả sản phẩm giày (không có phân trang)
const getShoes = asyncHandler(async (req, res) => {
  try {
    // Lấy tất cả sản phẩm giày từ database
    const shoes = await Shoes.find({}).lean();

    // Trả về danh sách giày
    res.status(200).json({
      data: {
        shoes, // Danh sách sản phẩm giày
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giày:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách giày", error });
  }
});

// Lấy sản phẩm giày theo productId
const getShoeById = asyncHandler(async (req, res) => {
  const shoes = await Shoes.findOne({ productId: req.params.productId }).lean();
  if (!shoes) {
    res.status(404);
    throw new Error("Shoe not found");
  }
  res.status(200).json({
    data: {
      shoes,
    },
  });
});

// Cập nhật sản phẩm giày
const updateShoe = asyncHandler(async (req, res) => {
  const updatedShoe = await Shoes.findOneAndUpdate(
    { productId: req.params.productId },
    req.body,
    { new: true } // Trả về tài liệu đã được cập nhật mới nhất
  );
  if (!updatedShoe) {
    res.status(404);
    throw new Error("Shoe not found");
  }
  res.status(200).json(updatedShoe);
});

// Xóa sản phẩm giày
const deleteShoe = asyncHandler(async (req, res) => {
  const shoe = await Shoes.findOneAndDelete({
    productId: req.params.productId,
  });
  if (!shoe) {
    res.status(404);
    throw new Error("Shoe not found");
  }
  res.status(200).json({ message: "Shoe deleted successfully" });
});

module.exports = {
  createShoe,
  getShoes,
  getShoeById,
  updateShoe,
  deleteShoe,
};
