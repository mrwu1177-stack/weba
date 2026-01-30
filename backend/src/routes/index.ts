import { FastifyInstance } from 'fastify';
import { marketRoutes } from './markets';
import { liquidationRoutes } from './liquidations';
import { strategyRoutes } from './strategies';
import { newsRoutes } from './news';
import { anomalyRoutes } from './anomalies';
import { metaRoutes } from './meta';
import { adminRoutes } from './admin';

export async function registerRoutes(fastify: FastifyInstance) {
  // Register all route modules
  await fastify.register(marketRoutes, { prefix: '/api/v1' });
  await fastify.register(liquidationRoutes, { prefix: '/api/v1' });
  await fastify.register(strategyRoutes, { prefix: '/api/v1' });
  await fastify.register(newsRoutes, { prefix: '/api/v1' });
  await fastify.register(anomalyRoutes, { prefix: '/api/v1' });
  await fastify.register(metaRoutes, { prefix: '/api/v1' });
  await fastify.register(adminRoutes, { prefix: '/api/v1' });
}
