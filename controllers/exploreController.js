const Explore = require("../src/models/exploreModel"); // Đảm bảo đã import đúng model

// Controller để lấy tất cả sản phẩm trong "explore"
const getAllExplores = async (req, res) => {
  try {
    // Tìm tất cả sản phẩm trong collection Explore
    const explores = await Explore.find({}).lean();
    console.log(explores);
    // Nếu không có sản phẩm nào, trả về thông báo
    if (!explores || explores.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Trả về dữ liệu sản phẩm
    res.status(200).json({
      data: {
        explores,
      },
    });
  } catch (error) {
    console.error("Error fetching explores:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller để lấy sản phẩm theo id
const getExploreById = async (req, res) => {
  const { id } = req.params; // Lấy id từ params

  try {
    // Tìm sản phẩm theo id
    const explore = await Explore.findById(id);

    // Nếu không tìm thấy sản phẩm, trả về thông báo
    if (!explore) {
      return res.status(200).json({
        data: null,
      });
    }

    // Trả về sản phẩm tìm thấy
    res.status(200).json({
      data: {
        explore,
      },
    });
  } catch (error) {
    console.error("Error fetching explore by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllExplores,
  getExploreById,
};
