import { FastifyInstance } from 'fastify';
import { getAnomalies } from '../services/anomalyService';
import { ApiResponse } from '../types';

export async function anomalyRoutes(fastify: FastifyInstance) {
  // Get market anomalies
  fastify.get<{ Querystring: { severity?: string; limit?: number } }>(
    '/anomalies',
    async (request, reply) => {
      const { severity, limit = 20 } = request.query;
      
      try {
        const anomalies = await getAnomalies({ severity, limit });

        const response: ApiResponse = {
          success: true,
          data: anomalies,
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
            message: error.message || 'Failed to fetch anomalies',
            code: 500,
            requestId: request.headers['x-request-id'],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );
}
