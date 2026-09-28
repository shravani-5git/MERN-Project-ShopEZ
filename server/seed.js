// Run with: npm run seed
// Creates one admin account, a sample coupon, and a few sample products.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding...');

  const adminEmail = 'admin@shopez.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'ShopEZ Admin', email: adminEmail, password: hashed, role: 'admin' });
    console.log(`Admin created -> email: ${adminEmail} / password: admin123`);
  } else {
    console.log('Admin already exists, skipping.');
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany([
      {
        name: 'Studio Bluetooth Headset',
        description: 'Wireless over-ear headset with cushioned earcups and clear everyday audio.',
        price: 79.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',
        stock: 25,
        discountPercent: 10,
      },
      {
        name: 'Everyday Canvas Sneakers',
        description: 'Lightweight casual sneakers with a flexible sole for daily wear.',
        price: 59.99,
        category: 'Footwear',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85',
        stock: 40,
        discountPercent: 0,
      },
      {
        name: 'Insulated Travel Tumbler',
        description: 'Double-wall tumbler designed to keep drinks cool while commuting.',
        price: 19.99,
        category: 'Home & Kitchen',
        imageUrl: 'https://images.unsplash.com/photo-1642698043660-a3827ca09337?auto=format&fit=crop&w=800&q=85',
        stock: 100,
        discountPercent: 5,
      },
      {
        name: 'Compact Mechanical Keyboard',
        description: 'Space-saving mechanical keyboard with tactile switches and backlight.',
        price: 89.99,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85',
        stock: 15,
        discountPercent: 0,
      },
    ]);
    console.log('Sample products created.');
  } else {
  console.log(`Found ${productCount} existing products. Updating their images...`);

  const productImages = {
    'Wireless Headphones':
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85',

    'Running Shoes':
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85',

    'Stainless Steel Water Bottle':
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',

    'Mechanical Keyboard':
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=85',
  };

  for (const [name, imageUrl] of Object.entries(productImages)) {
    const result = await Product.updateOne(
      { name: name },
      { $set: { imageUrl: imageUrl } }
    );

    console.log(
      `${name}: matched ${result.matchedCount}, modified ${result.modifiedCount}`
    );
  }

  console.log('Product image update finished.');
}

  const existingCoupon = await Coupon.findOne({ code: 'SHOPEZ10' });
  if (!existingCoupon) {
    await Coupon.create({ code: 'SHOPEZ10', discountPercent: 10, active: true });
    console.log('Sample coupon created -> code: SHOPEZ10 (10% off)');
  } else {
    console.log('Coupon already exists, skipping.');
  }

  console.log('Seeding complete.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
