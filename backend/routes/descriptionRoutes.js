const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const generateDescription = require("../services/DescriptionGenerator");

// POST /api/generate-description — single product
router.post("/", async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const description = await generateDescription(product);

    product.description = description;
    await product.save();

    res.status(200).json({
      productId: product._id,
      name: product.name,
      description: description,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/generate-description/bulk — multiple products
// POST /api/generate-description/bulk — stream results one by one
router.post("/bulk", async (req, res) => {
  try {
    const { limit = 10, productIds } = req.body;

    let products;
    if (productIds && productIds.length > 0) {
      // Manual selection
      products = await Product.find({ _id: { $in: productIds } });
    } else {
      // Auto — find products without descriptions
      products = await Product.find({ description: "" }).limit(parseInt(limit));
    }

    if (products.length === 0) {
      return res.json({
        message: "No products need descriptions!",
        results: [],
      });
    }

    // Set headers for streaming
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("X-Accel-Buffering", "no");

    const results = [];

    for (const product of products) {
      try {
        const description = await generateDescription(product);
        product.description = description;
        await product.save();

        const result = {
          _id: product._id,
          name: product.name,
          description,
          success: true,
        };
        results.push(result);

        // Stream each result as it completes
        res.write(JSON.stringify(result) + "\n");

        // Delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (err) {
        const result = {
          _id: product._id,
          name: product.name,
          success: false,
          error: err.message,
        };
        results.push(result);
        res.write(JSON.stringify(result) + "\n");
      }
    }

    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
