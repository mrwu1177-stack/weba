import { randomUUID } from 'crypto';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function requestIdMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const requestId = (request.headers['x-request-id'] as string) || randomUUID();
  request.headers['x-request-id'] = requestId;
  reply.header('x-request-id', requestId);
}
