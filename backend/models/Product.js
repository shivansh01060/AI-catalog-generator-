const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    spec: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "Unknown",
    },
    description: {
      // space to add the ai product discription
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    ProductVector: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Product", ProductSchema);
