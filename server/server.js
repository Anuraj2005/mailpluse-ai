import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { logger } from './src/utils/logger.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

import authRoutes from './src/routes/authRoutes.js';
import emailRoutes from './src/routes/emailRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const isProd = process.env.NODE_ENV === 'production';

// Trust Render/Heroku reverse proxy so req.ip and secure cookies work
if (isProd) app.set('trust proxy', 1);

// Connect Database
connectDB();

// Security and utility middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Allow the configured client origin plus any Vercel production deployment and local dev ports.
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow server-to-server (no origin), listed origins, and any Vercel production origin.
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);

    try {
      const parsedOrigin = new URL(origin);
      const isLocalhost = parsedOrigin.hostname === 'localhost' || parsedOrigin.hostname === '127.0.0.1';
      const isVercelProduction = parsedOrigin.protocol === 'https:' && parsedOrigin.hostname.endsWith('.vercel.app');

      if (isLocalhost || isVercelProduction) return cb(null, true);
    } catch {
      // Fall through to rejection below.
    }

    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// API Routes Mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/emails', emailRoutes);
app.use('/api/v1/ai', aiRoutes);

// Root endpoint helper
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MailPulse AI API Server!',
    webAppUrl: CLIENT_URL,
    healthCheck: '/api/health',
    apiDocs: '/api/v1',
  });
});

// Health check root
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'MailPulse AI API Engine',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.success(`🚀 MailPulse AI Server running on http://localhost:${PORT}`);
  logger.info(`📡 Client Origin allowed: ${CLIENT_URL}`);
});
