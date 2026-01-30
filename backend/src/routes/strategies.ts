import { FastifyInstance } from 'fastify';
import { getStrategySignals, getBollingerBands, getMultiCoinStrategies } from '../services/strategyService';
import { ApiResponse } from '../types';

export async function strategyRoutes(fastify: FastifyInstance) {
  // Get strategy signals
  fastify.get<{ Querystring: { signal_type?: string; limit?: number; coin_symbol?: string } }>(
    '/strategies/signals',
    async (request, reply) => {
      const { signal_type, limit = 20, coin_symbol } = request.query;
      
      try {
        const signals = await getStrategySignals({ 
          signalType: signal_type, 
          limit,
          coinSymbol: coin_symbol,
        });

        const response: ApiResponse = {
          success: true,
          data: signals,
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
            message: error.message || 'Failed to fetch strategy signals',
            code: 500,
            requestId: request.headers['x-request-id'],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );

  // Get Bollinger Bands data
  fastify.get<{ Params: { symbol: string } }>(
    '/strategies/bollinger-bands/:symbol',
    async (request, reply) => {
      const { symbol } = request.params;
      
      try {
        const bollingerData = await getBollingerBands(symbol);

        const response: ApiResponse = {
          success: true,
          data: bollingerData,
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
            message: error.message || 'Failed to fetch Bollinger Bands data',
            code: 500,
            requestId: request.headers['x-request-id'],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );

  // Get multi-coin strategies
  fastify.get('/strategies/multi-coin', async (request, reply) => {
    try {
      const strategies = await getMultiCoinStrategies();

      const response: ApiResponse = {
        success: true,
        data: strategies,
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
          message: error.message || 'Failed to fetch multi-coin strategies',
          code: 500,
          requestId: request.headers['x-request-id'],
          timestamp: new Date().toISOString(),
        },
      });
    }
  });
}
