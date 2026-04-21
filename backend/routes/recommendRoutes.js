const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const {
  getAIRecommendations,
  getDatasetRecommendations,
} = require("../services/Recommendation"); // ✅ fixed imports

router.post("/", async (req, res) => {
  try {
    const { productId } = req.body;

    const targetProduct = await Product.findById(productId);
    if (!targetProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get products from same category
    const allProducts = await Product.find({
      category: targetProduct.category,
    }).limit(200);

    // ✅ Run AI + dataset recommendations in parallel
    const [aiRecs, datasetRecs] = await Promise.all([
      getAIRecommendations(targetProduct),
      allProducts.length >= 2
        ? getDatasetRecommendations(targetProduct, allProducts)
        : Promise.resolve([]),
    ]);

    res.status(200).json({
      targetProduct: {
        _id: targetProduct._id,
        name: targetProduct.name,
        category: targetProduct.category,
      },
      aiRecommendations: aiRecs, // ✅ AI suggestions
      recommendations: datasetRecs, // ✅ dataset matches
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
