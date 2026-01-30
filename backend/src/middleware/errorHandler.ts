import { FastifyRequest, FastifyReply } from 'fastify';
import { createLogger } from '../utils/logger';

const logger = createLogger('errorHandler');

export async function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const requestId = (request.headers['x-request-id'] as string) || 'unknown';
  
  logger.error({
    requestId,
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
  });

  // Determine status code
  const statusCode = (error as any).statusCode || 500;

  // Send error response
  reply.status(statusCode).send({
    success: false,
    error: {
      message: error.message,
      code: statusCode,
      requestId,
      timestamp: new Date().toISOString(),
    },
  });
}
