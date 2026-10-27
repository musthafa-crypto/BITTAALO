import swaggerUi from 'swagger-ui-express';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'BITTAALO E-Commerce REST API',
    version: '1.0.0',
    description: 'Complete REST API documentation for the BITTAALO lifestyle accessories e-commerce platform in India.',
    contact: {
      name: 'BITTAALO Support',
      email: 'bittaalo@gmail.com',
      phone: '+91 9037489104',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Development Server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and profile management' },
    { name: 'Products', description: 'Browse and search product catalog' },
    { name: 'Categories', description: 'Access 12 lifestyle categories' },
    { name: 'Cart', description: 'Bag management with persistent DB sync' },
    { name: 'Wishlist', description: 'Saved customer items' },
    { name: 'Orders', description: 'Order placement and lifecycle' },
    { name: 'Payments', description: 'Razorpay payment flow and verification' },
    { name: 'Reviews', description: 'Ratings and verified reviews' },
    { name: 'Coupons', description: 'Discount coupons validation' },
    { name: 'Contact', description: 'Inquiry forms and support' },
    { name: 'Admin', description: 'Dashboard metrics, CRUD and status updates' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new customer account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Rohan Sharma' },
                  email: { type: 'string', example: 'rohan@example.com' },
                  password: { type: 'string', example: 'SecurePassword123' },
                  phone: { type: 'string', example: '9876543210' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Registration successful' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate and receive JWT cookies',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@bittaalo.com' },
                  password: { type: 'string', example: 'Admin@12345' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login successful' } },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products with filtering, search, and pagination',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category slug or ID' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price-asc', 'price-desc', 'newest', 'popular', 'rating'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
        ],
        responses: { 200: { description: 'Paginated product list' } },
      },
    },
    '/products/{slug}': {
      get: {
        tags: ['Products'],
        summary: 'Get single product details by slug or ID',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Product detail object' } },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List all 12 accessory categories with counts',
        responses: { 200: { description: 'List of categories' } },
      },
    },
    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Place a new order (Razorpay or COD)',
        responses: { 201: { description: 'Order created' } },
      },
    },
    '/payments/verify': {
      post: {
        tags: ['Payments'],
        summary: 'Verify Razorpay payment signature',
        responses: { 200: { description: 'Payment verified' } },
      },
    },
    '/contact': {
      post: {
        tags: ['Contact'],
        summary: 'Submit inquiry message (saved to DB & emailed)',
        responses: { 201: { description: 'Message sent' } },
      },
    },
    '/admin/stats': {
      get: {
        tags: ['Admin'],
        summary: 'Get dashboard KPI metrics and sales history',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Dashboard metrics' } },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerDocument);
