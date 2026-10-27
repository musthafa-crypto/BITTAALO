import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { seedDatabase } from '../src/seeds/seed.js';

describe('BITTAALO REST API Test Suite', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    await seedDatabase();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  // 1. Health check
  it('GET /api/v1/health should return ok status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.brand).toBe('BITTAALO');
  });

  // 2. Categories
  it('GET /api/v1/categories should return all 12 accessory categories', async () => {
    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.categories.length).toBe(12);
  });

  // 3. Products
  it('GET /api/v1/products should return paginated accessory items', async () => {
    const res = await request(app).get('/api/v1/products?limit=6');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products.length).toBe(6);
    expect(res.body.total).toBeGreaterThanOrEqual(48);
  });

  // 4. Single Product by Slug
  it('GET /api/v1/products/:slug should return product details', async () => {
    const res = await request(app).get('/api/v1/products/onyx-hex-polarized-sunglasses');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product.name).toContain('Onyx Hex');
  });

  // 5. Auth - Customer Login
  it('POST /api/v1/auth/login should authenticate customer and set cookies', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'customer@bittaalo.com', password: 'Customer@12345' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  // 6. Auth - Admin Login
  it('POST /api/v1/auth/login should authenticate admin user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@bittaalo.com', password: 'Admin@12345' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('admin');
  });

  // 7. Coupons
  it('POST /api/v1/coupons/validate should calculate discount correctly', async () => {
    const res = await request(app)
      .post('/api/v1/coupons/validate')
      .send({ code: 'WELCOME10', cartTotal: 2000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.coupon.discountAmount).toBe(200); // 10% of 2000
  });

  // 8. Contact Form
  it('POST /api/v1/contact should record message and trigger notification', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'Test Customer',
        email: 'test@example.com',
        subject: 'Product Query',
        message: 'Looking for restock on cyber sunglasses',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });
});
