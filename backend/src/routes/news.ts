import { FastifyInstance } from 'fastify';
import { getNews } from '../services/newsService';
import { ApiResponse } from '../types';

export async function newsRoutes(fastify: FastifyInstance) {
  // Get news
  fastify.get<{ Querystring: { limit?: number; coin_symbol?: string; source?: string } }>(
    '/news',
    async (request, reply) => {
      const { limit = 20, coin_symbol, source } = request.query;
      
      try {
        const news = await getNews({ limit, coinSymbol: coin_symbol, source });

        const response: ApiResponse = {
          success: true,
          data: news,
          meta: {
            timestamp: new Date().toISOString(),
            cached: false,
            requestId: request.headers['x-request-id'] as string,
          },
        };

        return reply.send(response);
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({
          success: false,
          error: {
            message: error.message || 'Failed to fetch news',
            code: 500,
            requestId: request.headers['x-request-id'],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );
}
