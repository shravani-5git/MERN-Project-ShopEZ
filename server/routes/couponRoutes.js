const express = require('express');
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/coupons - admin only, list all coupons
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch coupons', error: err.message });
  }
});

// POST /api/coupons - admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { code, discountPercent } = req.body;
    if (!code || !discountPercent) {
      return res.status(400).json({ message: 'code and discountPercent are required' });
    }
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({ code, discountPercent });
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create coupon', error: err.message });
  }
});

// PUT /api/coupons/:id - admin only (e.g. toggle active)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update coupon', error: err.message });
  }
});

// DELETE /api/coupons/:id - admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete coupon', error: err.message });
  }
});

// POST /api/coupons/validate - logged in customers, checked during checkout
router.post('/validate', protect, async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: (code || '').toUpperCase(), active: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code' });
    }
    res.json({ code: coupon.code, discountPercent: coupon.discountPercent });
  } catch (err) {
    res.status(500).json({ message: 'Failed to validate coupon', error: err.message });
  }
});

module.exports = router;
