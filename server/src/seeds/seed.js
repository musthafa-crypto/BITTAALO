import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Banner } from '../models/Banner.js';
import { Review } from '../models/Review.js';
import { categoriesData, productsData, couponsData, bannersData } from './seedData.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Banner.deleteMany({}),
      Review.deleteMany({}),
    ]);

    console.log('[Seed] Creating Admin and Customer users...');
    const adminUser = await User.create({
      name: 'BITTAALO Admin',
      email: 'admin@bittaalo.com',
      password: 'Admin@12345',
      role: 'admin',
      phone: '9037489104',
      addresses: [
        {
          fullName: 'BITTAALO Headquarters',
          phone: '9037489104',
          street: '14 MG Road, Lifestyle Plaza',
          landmark: 'Opposite Metro Station',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560001',
          isDefault: true,
        },
      ],
    });

    const customerUser = await User.create({
      name: 'Rohan Sharma',
      email: 'customer@bittaalo.com',
      password: 'Customer@12345',
      role: 'customer',
      phone: '9876543210',
      addresses: [
        {
          fullName: 'Rohan Sharma',
          phone: '9876543210',
          street: 'Apt 402, Skyline Residency, Bandra West',
          landmark: 'Near Hill Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400050',
          isDefault: true,
        },
      ],
    });

    console.log('[Seed] Seeding 12 Categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('[Seed] Seeding 48 Products...');
    const productsToInsert = productsData.map((prod, idx) => {
      const categoryId = categoryMap[prod.categorySlug];
      const slug = prod.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      return {
        ...prod,
        slug,
        sku: `BIT-${prod.categorySlug.toUpperCase().slice(0, 3)}-${1001 + idx}`,
        category: categoryId,
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);

    console.log('[Seed] Seeding Coupons & Banners...');
    await Coupon.insertMany(couponsData);
    await Banner.insertMany(bannersData);

    console.log('[Seed] Seeding Sample Reviews...');
    const sampleReviews = [
      {
        product: createdProducts[0]._id,
        user: customerUser._id,
        rating: 5,
        title: 'Outstanding build quality & polarization',
        comment: 'These shades look and feel like something double the price. Heavy acetate, zero glare while driving in peak afternoon sun. Highly recommended!',
        verifiedPurchase: true,
      },
      {
        product: createdProducts[4]._id,
        user: customerUser._id,
        rating: 5,
        title: 'Perfect streetwear dad cap',
        comment: 'The washed texture is spot on and the embroidery is clean. Fits snugly with the adjustable brass buckle.',
        verifiedPurchase: true,
      },
      {
        product: createdProducts[8]._id,
        user: customerUser._id,
        rating: 5,
        title: 'Solid heavy weight chain',
        comment: 'Doesn’t irritate skin at all, genuine stainless steel. The clasp is super secure.',
        verifiedPurchase: true,
      },
    ];
    await Review.insertMany(sampleReviews);

    console.log('\n==========================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Products:   ${createdProducts.length}`);
    console.log(`- Admin:      admin@bittaalo.com / Admin@12345`);
    console.log(`- Customer:   customer@bittaalo.com / Customer@12345`);
    console.log('==========================================\n');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    throw err;
  }
};

// If run directly via node src/seeds/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
