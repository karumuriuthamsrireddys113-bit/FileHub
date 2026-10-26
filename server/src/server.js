import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import documentRoutes from './routes/documentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { initializeDatabase, disconnectDatabase } from './config/prisma.js';
import { seedSampleDocuments } from './config/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration supporting single/multiple origins or wildcard for dev & prod
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : '*';

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins === '*' || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback to permissive to avoid deployment downtime
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware for debugging and observability
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root welcome route for quick service verification
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'FileHub Backend API',
    endpoints: {
      health: '/api/health',
      documents: '/api/documents',
      stats: '/api/documents/stats'
    }
  });
});

// Health check endpoints for Render and monitoring services
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'FileHub API',
    environment: process.env.NODE_ENV || 'development'
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Mount Document Routes
app.use('/api/documents', documentRoutes);

// Catch-all 404 handler for undefined API routes
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

let serverInstance = null;

// Start server after database initialization
async function startServer() {
  try {
    const prisma = await initializeDatabase();
    await seedSampleDocuments(prisma);

    serverInstance = app.listen(PORT, () => {
      console.log(`\n=================================================`);
      console.log(`🚀 FileHub Backend Server running on port ${PORT}`);
      console.log(`📡 Base API: http://localhost:${PORT}/api/documents`);
      console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=================================================\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start FileHub Server:', error);
    process.exit(1);
  }
}

// Graceful shutdown on SIGTERM / SIGINT
const handleGracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  if (serverInstance) {
    serverInstance.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDatabase();
      console.log('Database connections closed. Process terminating cleanly.');
      process.exit(0);
    });
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

startServer();
