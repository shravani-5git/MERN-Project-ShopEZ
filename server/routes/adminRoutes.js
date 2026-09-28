const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

// GET /api/admin/orders - all orders, newest first
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// PUT /api/admin/orders/:id/status - update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['placed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
});

// GET /api/admin/analytics - basic sales stats for the dashboard
router.get('/analytics', async (req, res) => {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

    const totalProducts = await Product.countDocuments();

    // tally quantity sold per product across all orders
    const salesByProduct = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.name;
        salesByProduct[key] = (salesByProduct[key] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(salesByProduct)
      .map(([name, quantitySold]) => ({ name, quantitySold }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    res.json({
      totalOrders,
      totalSales: Math.round(totalSales * 100) / 100,
      totalProducts,
      topProducts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
});

module.exports = router;
