const express = require("express");
const router = express.Router();
const CatalogEntry = require("../models/CatalogEntry");

// GET /api/catalog — Get all catalog entries with product details
router.get("/", async (req, res) => {
  try {
    const entries = await CatalogEntry.find()
      .populate("productEntry") // replaces productId with full product data
      .populate("recommendation"); // replaces IDs with full product objects
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
