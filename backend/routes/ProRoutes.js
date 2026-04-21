const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const upload = require("../middleware/upload");
const path = require("path");
router.post("/", async (req, res) => {
  try {
    const { name, category, price, spec, brand, description, ProductVector } =
      req.body;
    const product = await Product.create({
      name,
      category,
      price,
      spec,
      brand,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET all products with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET /api/products/stats — Dashboard metrics
router.get("/stats", async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const withDesc = await Product.countDocuments({
      description: { $ne: "" },
    });
    const withoutDesc = total - withDesc;
    const categories = await Product.distinct("category");
    const brands = await Product.distinct("brand");

    // Average price
    const priceData = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$price" },
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
        },
      },
    ]);

    res.json({
      totalProducts: total,
      withDescriptions: withDesc,
      withoutDescriptions: withoutDesc,
      totalCategories: categories.length,
      totalBrands: brands.length,
      avgPrice: Math.round(priceData[0]?.avgPrice || 0),
      maxPrice: priceData[0]?.maxPrice || 0,
      minPrice: priceData[0]?.minPrice || 0,
      descriptionCoverage: Math.round((withDesc / total) * 100),
      timeSavedMinutes: withDesc * 17, // 17 min avg manual vs 2 sec AI
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET /api/products/search — Advanced search with filters
router.get("/search", async (req, res) => {
  try {
    const {
      q, // search query
      minPrice, // min price
      maxPrice, // max price
      brand, // brand name
      category, // category
      hasDesc, // has AI description
      sortBy, // price_asc, price_desc, name_asc, newest
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object
    const filter = {};

    // Text search
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Brand filter
    if (brand && brand !== "all") {
      filter.brand = { $regex: brand, $options: "i" };
    }

    // Category filter
    if (category && category !== "all") {
      filter.category = { $regex: category, $options: "i" };
    }

    // Has AI description
    if (hasDesc === "true") {
      filter.description = { $ne: "" };
    }

    // Sort
    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
      newest: { createdAt: -1 },
    };
    const sort = sortMap[sortBy] || { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + products.length < total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET /api/products/filters — get unique brands and categories
router.get("/filters", async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    const categories = await Product.distinct("category");

    const shortCategories = [
      ...new Set(
        categories
          .map((c) =>
            c
              ?.split(">>")[0]
              ?.replace(/[\[\]"]/g, "")
              .trim(),
          )
          .filter(Boolean),
      ),
    ].slice(0, 50);

    res.json({
      brands: brands.filter(Boolean).sort().slice(0, 100),
      categories: shortCategories.sort(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET /api/products/analytics — detailed analytics data
router.get("/analytics", async (req, res) => {
  try {
    // Top 10 categories by product count
    const categoryData = await Product.aggregate([
      {
        $group: {
          _id: { $arrayElemAt: [{ $split: ["$category", ">>"] }, 0] },
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: {
            $trim: {
              input: {
                $replaceAll: { input: "$_id", find: '["', replacement: "" },
              },
            },
          },
          count: 1,
          avgPrice: { $round: ["$avgPrice", 0] },
        },
      },
    ]);

    // Top 10 brands by product count
    const brandData = await Product.aggregate([
      { $match: { brand: { $ne: "Unknown" } } },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { name: "$_id", count: 1 } },
    ]);

    // Price distribution buckets
    const priceRanges = [
      { label: "Under ₹500", min: 0, max: 500 },
      { label: "₹500-1K", min: 500, max: 1000 },
      { label: "₹1K-5K", min: 1000, max: 5000 },
      { label: "₹5K-10K", min: 5000, max: 10000 },
      { label: "₹10K-25K", min: 10000, max: 25000 },
      { label: "₹25K-50K", min: 25000, max: 50000 },
      { label: "Above ₹50K", min: 50000, max: 999999999 },
    ];

    const priceData = await Promise.all(
      priceRanges.map(async (range) => ({
        name: range.label,
        count: await Product.countDocuments({
          price: { $gte: range.min, $lt: range.max },
        }),
      })),
    );

    // AI description coverage over time (by creation date)
    const coverageData = await Product.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: 1 },
          withDesc: { $sum: { $cond: [{ $ne: ["$description", ""] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
      {
        $project: {
          date: "$_id",
          total: 1,
          withDesc: 1,
          coverage: {
            $round: [
              { $multiply: [{ $divide: ["$withDesc", "$total"] }, 100] },
              1,
            ],
          },
        },
      },
    ]);

    // Overall summary
    const total = await Product.countDocuments();
    const withDesc = await Product.countDocuments({ description: { $ne: "" } });

    res.json({
      categoryData,
      brandData,
      priceData,
      coverageData,
      summary: {
        total,
        withDesc,
        withoutDesc: total - withDesc,
        coverage: Math.round((withDesc / total) * 100),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST /api/products/:id/image — upload product image
router.post("/:id/image", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { imageUrl },
      { new: true },
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ imageUrl, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/products/:id/image-url — save image by URL
router.put("/:id/image-url", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { imageUrl },
      { new: true },
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ imageUrl, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/products/:id — Update a product
router.put("/:id", async (req, res) => {
  try {
    const { name, category, brand, spec, price } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, brand, spec, price },
      { new: true }, // returns updated product
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
