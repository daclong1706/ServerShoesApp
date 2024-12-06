const express = require("express");
const router = express.Router();
const exploreController = require("../../controllers/exploreController");

// Route để lấy tất cả sản phẩm
router.get("/", exploreController.getAllExplores);

// Route để lấy sản phẩm theo ID
router.get("/:id", exploreController.getExploreById);

module.exports = router;
