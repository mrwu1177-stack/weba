import { FastifyInstance } from 'fastify';
import { getMarketData, getMarketBySymbol } from '../services/marketService';
import { ApiResponse } from '../types';

export async function marketRoutes(fastify: FastifyInstance) {
  // Get all markets with pagination
  fastify.get<{ Querystring: { vs_currency?: string; per_page?: number; page?: number; order?: string } }>(
    '/markets',
    async (request, reply) => {
      const { vs_currency = 'usd', per_page = 50, page = 1, order = 'market_cap_desc' } = request.query;
      
      try {
        const markets = await getMarketData({
          vsCurrency: vs_currency,
          perPage: per_page,
          page: page,
          order,
        });

        const response: ApiResponse = {
          success: true,
          data: markets,
          meta: {
            timestamp: new Date().toISOString(),
            cached: false, // TODO: Add cache flag
            requestId: request.headers['x-request-id'] as string,
          },
        };

        return reply.send(response);
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({
          success: false,
          error: {
            message: error.message || 'Failed to fetch market data',
            code: 500,
            requestId: request.headers['x-request-id'],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );

  // Get market by symbol
  fastify.get<{ Params: { symbol: string } }>(
    '/markets/:symbol',
    async (request, reply) => {
      const { symbol } = request.params;
      
      try {
        const market = await getMarketBySymbol(symbol);
        
        if (!market) {
          return reply.status(404).send({
            success: false,
            error: {
              message: `Market with symbol ${symbol} not found`,
              code: 404,
              requestId: request.headers['x-request-id'],
              timestamp: new Date().toISOString(),
            },
          });
        }

        const response: ApiResponse = {
          success: true,
          data: market,
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
            message: error.message || 'Failed to fetch market data',
            code: 500,
            requestId: request.headers['x-request-id'],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );
}
