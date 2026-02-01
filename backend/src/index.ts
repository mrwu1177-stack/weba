import { fastify } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createLogger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestIdMiddleware } from './middleware/requestId';
import { initRedis } from './utils/redis';
import { registerRoutes } from './routes';
import { initWebSocket } from './websocket';
import { startCronJobs } from './jobs';

// Load environment variables
dotenv.config();

const logger = createLogger();
const prisma = new PrismaClient();

// Initialize Fastify server
const fastify = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register plugins
async function setupServer() {
  // CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'),
    skipOnError: true,
  });

  // WebSocket
  await fastify.register(websocket);

  // Custom middleware
  fastify.addHook('onRequest', requestIdMiddleware);
  fastify.setErrorHandler(errorHandler);

  // Initialize Redis
  try {
    await initRedis();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    process.exit(1);
  }

  // Test database connection
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    process.exit(1);
  }

  // Register routes
  await registerRoutes(fastify);

  // Initialize WebSocket
  initWebSocket(fastify);

  // Start cron jobs
  startCronJobs();
}

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  };
});

// API metadata endpoint
fastify.get('/api/v1/meta', async (request, reply) => {
  return {
    name: 'HelloYan API',
    version: '1.0.0',
    endpoints: {
      markets: '/api/v1/markets',
      liquidations: '/api/v1/liquidations',
      strategies: '/api/v1/strategies',
      news: '/api/v1/news',
      anomalies: '/api/v1/anomalies',
    },
    features: {
      realtime: true,
      caching: true,
      websocket: true,
    },
  };
});

// Graceful shutdown
async function closeGracefully(signal: string) {
  logger.info(`Received signal to terminate: ${signal}`);
  
  await fastify.close();
  await prisma.$disconnect();
  
  logger.info('Server closed gracefully');
  process.exit(0);
}

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));

// Start server
async function start() {
  try {
    await setupServer();
    
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    logger.info(`🚀 Server running on http://${host}:${port}`);
    logger.info(`📚 API documentation: http://${host}:${port}/api/v1/meta`);
    logger.info(`💚 Health check: http://${host}:${port}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

export { fastify, prisma };
