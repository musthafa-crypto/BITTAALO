import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { Product } from './models/Product.js';
import { seedDatabase } from './seeds/seed.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty for seamless zero-step experience
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Startup] Empty database detected. Auto-seeding initial accessories catalog...');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`\n=================================================`);
      console.log(`🚀 BITTAALO Server running on port ${PORT}`);
      console.log(`🌐 Base URL:       http://localhost:${PORT}`);
      console.log(`📑 Swagger Docs:   http://localhost:${PORT}/api-docs`);
      console.log(`🛒 API Endpoint:   http://localhost:${PORT}/api/v1`);
      console.log(`📞 Support WA:     +91 9037489104`);
      console.log(`=================================================\n`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
