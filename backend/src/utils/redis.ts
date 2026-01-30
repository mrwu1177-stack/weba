import Redis from 'ioredis';
import { logger } from './logger';

let redisClient: Redis | null = null;

export async function initRedis(): Promise<void> {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('error', (error) => {
      logger.error('Redis client error:', error);
    });

    // Test connection
    await redisClient.ping();
    logger.info('Redis connection test successful');
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
    throw error;
  }
}

export function getRedis(): Redis {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  return redisClient;
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    const data = await redis.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch (error) {
    logger.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
}

export async function setCached<T>(
  key: string,
  value: T,
  ttl: number = 60
): Promise<void> {
  try {
    const redis = getRedis();
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error(`Error setting cache for key ${key}:`, error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.del(key);
  } catch (error) {
    logger.error(`Error deleting cache for key ${key}:`, error);
  }
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const redis = getRedis();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    logger.error(`Error deleting cache pattern ${pattern}:`, error);
  }
}
