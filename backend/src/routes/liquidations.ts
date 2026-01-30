import { FastifyInstance } from 'fastify';
import { getLiquidations, getLiquidationChart } from '../services/liquidationService';
import { ApiResponse } from '../types';

export async function liquidationRoutes(fastify: FastifyInstance) {
  // Get liquidations list
  fastify.get<{ Querystring: { symbol?: string; limit?: number; offset?: number } }>(
    '/liquidations',
    async (request, reply) => {
      const { symbol, limit = 50, offset = 0 } = request.query;
      
      try {
        const liquidations = await getLiquidations({ symbol, limit, offset });

        const response: ApiResponse = {
          success: true,
          data: liquidations,
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
            message: error.message || 'Failed to fetch liquidation data',
            code: 500,
            requestId: request.headers['x-request-id'],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );

  // Get liquidation chart data
  fastify.get<{ Params: { symbol: string }; Querystring: { timeframe?: string } }>(
    '/liquidations/:symbol/chart',
    async (request, reply) => {
      const { symbol } = request.params;
      const { timeframe = '24h' } = request.query;
      
      try {
        const chartData = await getLiquidationChart(symbol, timeframe);

        const response: ApiResponse = {
          success: true,
          data: chartData,
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
            message: error.message || 'Failed to fetch liquidation chart',
            code: 500,
            requestId: request.headers['x-request-id'],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );
}
