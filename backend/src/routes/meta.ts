import { FastifyInstance } from 'fastify';
import { ApiResponse } from '../types';

export async function metaRoutes(fastify: FastifyInstance) {
  // API metadata
  fastify.get('/meta', async (request, reply) => {
    const response: ApiResponse = {
      success: true,
      data: {
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
        timestamp: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
        cached: false,
        requestId: request.headers['x-request-id'] as string,
      },
    };

    return reply.send(response);
  });
}
