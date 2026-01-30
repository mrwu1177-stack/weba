import { PrismaClient } from '@prisma/client';
import { getCached, setCached } from '../utils/redis';
import { logger } from '../utils/logger';
import { MarketAnomaly } from '../types';

const prisma = new PrismaClient();

export interface AnomalyQueryOptions {
  severity?: string;
  limit?: number;
}

export async function getAnomalies(options: AnomalyQueryOptions = {}): Promise<MarketAnomaly[]> {
  const cacheKey = `anomalies:${JSON.stringify(options)}`;
  const cacheTTL = 60;

  try {
    const cached = await getCached<MarketAnomaly[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const anomalies = await prisma.marketAnomaly.findMany({
      where: options.severity ? { severity: options.severity as any } : undefined,
      orderBy: { timestamp: 'desc' },
      take: options.limit || 20,
    });

    const result = anomalies.map(a => ({
      id: a.id,
      coinId: a.coinId,
      coinSymbol: a.coinSymbol,
      type: a.type,
      severity: a.severity,
      description: a.description,
      metadata: a.metadata,
      timestamp: a.timestamp,
    }));

    await setCached(cacheKey, result, cacheTTL);

    return result;
  } catch (error: any) {
    logger.error('Error fetching anomalies:', error);
    throw new Error('Failed to fetch anomalies');
  }
}
