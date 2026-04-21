const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

// GET /api/reviews/:productId — get all reviews for a product
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort(
      { createdAt: -1 },
    );

    const avgRating =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) *
              10,
          ) / 10
        : 0;

    res.json({
      reviews,
      totalReviews: reviews.length,
      avgRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reviews/:productId — add a review (protected)
router.post("/:productId", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    // Check if user already reviewed this product
    const existing = await Review.findOne({
      productId: req.params.productId,
      userId: req.user._id,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      productId: req.params.productId,
      userId: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/reviews/:productId — edit your review (protected)
router.put("/:productId", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      productId: req.params.productId,
      userId: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.rating = Number(rating) || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/reviews/:productId — delete your review (protected)
router.delete("/:productId", protect, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      productId: req.params.productId,
      userId: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
