import { fastify, FastifyReply } from 'fastify';
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
const server = fastify({
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
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Rate limiting
  await server.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'),
    skipOnError: true,
  });

  // WebSocket
  await server.register(websocket);

  // Custom middleware
  server.addHook('onRequest', requestIdMiddleware);
  server.setErrorHandler(errorHandler);

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
  await registerRoutes(server);

  // Initialize WebSocket
  initWebSocket(server);

  // Start cron jobs
  startCronJobs();
}

// Health check endpoint
server.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  };
});

// API metadata endpoint
server.get('/api/v1/meta', async (request, reply) => {
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
  
  await server.close();
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
    
    await server.listen({ port, host });
    logger.info(`🚀 Server running on http://${host}:${port}`);
    logger.info(`📚 API documentation: http://${host}:${port}/api/v1/meta`);
    logger.info(`💚 Health check: http://${host}:${port}/health`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();

export { server, prisma };