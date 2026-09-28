const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - place an order (mock payment always succeeds)
router.post('/', protect, async (req, res) => {
  try {
    const { items, couponCode } = req.body; // items: [{ productId, quantity }]
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      const effectivePrice =
        product.price - (product.price * (product.discountPercent || 0)) / 100;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: Math.round(effectivePrice * 100) / 100,
        quantity: item.quantity,
      });
      subtotal += effectivePrice * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    let discountAmount = 0;
    let appliedCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (coupon) {
        discountAmount = (subtotal * coupon.discountPercent) / 100;
        appliedCode = coupon.code;
      }
    }

    const total = Math.round((subtotal - discountAmount) * 100) / 100;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      couponCode: appliedCode,
      discountAmount: Math.round(discountAmount * 100) / 100,
      total,
      status: 'placed',
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});

// GET /api/orders/myorders - logged in user's order history
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// GET /api/orders/:id - order detail (owner or admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
});

module.exports = router;
