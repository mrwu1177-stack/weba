import { FastifyInstance } from 'fastify';
import { websocketPlugin } from '@fastify/websocket';
import { logger } from '../utils/logger';
import { WSMessage } from '../types';

const connectedClients = new Set();

export function initWebSocket(fastify: FastifyInstance) {
  fastify.register(async (fastify) => {
    fastify.get('/ws', { websocket: true }, (connection, req) => {
      logger.info('WebSocket client connected');
      connectedClients.add(connection);

      // Send initial connection message
      const welcomeMessage: WSMessage = {
        type: 'ping',
        data: { message: 'Connected to HelloYan WebSocket' },
        timestamp: new Date().toISOString(),
      };
      connection.socket.send(JSON.stringify(welcomeMessage));

      // Handle incoming messages
      connection.socket.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          logger.debug('Received WebSocket message:', message);

          // Handle different message types
          if (message.type === 'subscribe') {
            // Handle subscription requests
            logger.info('Client subscribed to:', message.topics);
          }
        } catch (error) {
          logger.error('Error parsing WebSocket message:', error);
        }
      });

      // Handle disconnect
      connection.socket.on('close', () => {
        logger.info('WebSocket client disconnected');
        connectedClients.delete(connection);
      });

      // Handle errors
      connection.socket.on('error', (error) => {
        logger.error('WebSocket error:', error);
      });
    });
  });

  logger.info('WebSocket server initialized');
}

export function broadcastMessage(message: WSMessage) {
  const data = JSON.stringify(message);

  for (const client of connectedClients) {
    try {
      client.socket.send(data);
    } catch (error) {
      logger.error('Error broadcasting WebSocket message:', error);
    }
  }
}

export function broadcastPriceUpdate(coinId: string, symbol: string, price: number, change24h: number) {
  const message: WSMessage = {
    type: 'price_update',
    data: { coinId, symbol, price, change24h },
    timestamp: new Date().toISOString(),
  };
  broadcastMessage(message);
}

export function broadcastLiquidation(coinSymbol: string, amount: number, side: 'long' | 'short') {
  const message: WSMessage = {
    type: 'liquidation',
    data: { coinSymbol, amount, side },
    timestamp: new Date().toISOString(),
  };
  broadcastMessage(message);
}

export function broadcastSignal(coinSymbol: string, signalType: 'buy' | 'sell', strength: number) {
  const message: WSMessage = {
    type: 'signal',
    data: { coinSymbol, signalType, strength },
    timestamp: new Date().toISOString(),
  };
  broadcastMessage(message);
}
