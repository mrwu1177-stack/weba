import { FastifyInstance } from 'fastify';
import { ApiResponse } from '../types';
import { getApiStatus, updateApiConfig } from '../services/adminService';

export async function adminRoutes(fastify: FastifyInstance) {
  // Get API status and monitoring data
  fastify.get('/admin/api-status', async (request, reply) => {
    try {
      const status = await getApiStatus();

      const response: ApiResponse = {
        success: true,
        data: status,
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
          message: error.message || 'Failed to fetch API status',
          code: 500,
          requestId: request.headers['x-request-id'],
          timestamp: new Date().toISOString(),
        },
      });
    }
  });

  // Update API configuration (admin only)
  fastify.post<{ Body: { apiName: string; apiKey: string; apiSecret?: string } }>(
    '/admin/api-config',
    async (request, reply) => {
      const { apiName, apiKey, apiSecret } = request.body;
      
      try {
        await updateApiConfig(apiName, { apiKey, apiSecret });

        const response: ApiResponse = {
          success: true,
          data: {
            message: 'API configuration updated successfully',
            apiName,
          },
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
            message: error.message || 'Failed to update API configuration',
            code: 500,
            requestId: request.headers['x-request-id'],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );

  // Get system logs (admin only)
  fastify.get<{ Querystring: { level?: string; limit?: number } }>(
    '/admin/logs',
    async (request, reply) => {
      const { level, limit = 50 } = request.query;
      
      try {
        // TODO: Implement log retrieval from database
        const logs: any[] = [];

        const response: ApiResponse = {
          success: true,
          data: logs,
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
            message: error.message || 'Failed to fetch system logs',
            code: 500,
            requestId: request.headers['x-request-id'],
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
  );
}
