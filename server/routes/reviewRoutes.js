const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/reviews/product/:productId
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
});

// POST /api/reviews - logged in users only
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return res.status(400).json({ message: 'productId and rating are required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(req.user.id);

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      userName: user.name,
      rating,
      comment,
    });

    // recalculate the product's average rating and review count
    const allReviews = await Review.find({ product: productId });
    const numReviews = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

    product.numReviews = numReviews;
    product.avgRating = Math.round(avgRating * 10) / 10;
    await product.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
});

module.exports = router;
