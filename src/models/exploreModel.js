const mongoose = require("mongoose");

// Định nghĩa Schema cho Explore (Khám phá sản phẩm)
const ExploreSchema = new mongoose.Schema({
  videoSource: {
    type: String,
  },
  product: {
    id: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    additionalImages: [
      {
        type: String,
      },
    ],
    detail: {
      title: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
    },
    highlight: {
      title: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
    },
  },
});

// Tạo model từ schema
const Explore = mongoose.model("Explore", ExploreSchema);

module.exports = Explore;
