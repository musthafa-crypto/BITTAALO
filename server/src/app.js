import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes/apiRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { serveSwagger, setupSwagger } from './docs/swagger.js';

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration (allow Vite dev server)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev convenience
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// HTTP Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded files statically
const uploadDir = path.resolve('uploads');
app.use('/uploads', express.static(uploadDir));

// Rate limiting
app.use('/api', generalLimiter);

// Swagger Documentation
app.use('/api-docs', serveSwagger, setupSwagger);

// API v1 Routes
app.use('/api/v1', apiRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    brand: 'BITTAALO',
    message: 'Welcome to BITTAALO REST API',
    documentation: '/api-docs',
    apiRoot: '/api/v1',
    whatsapp: '+91 9037489104',
    email: 'bittaalo@gmail.com',
  });
});

// 404 & Centralized Error Handler
app.use(notFound);
app.use(errorHandler);

export default app;
