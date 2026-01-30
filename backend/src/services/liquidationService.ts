import { PrismaClient } from '@prisma/client';
import { getCached, setCached } from '../utils/redis';
import { logger } from '../utils/logger';
import axios from 'axios';
import { Liquidation, LiquidationChartData } from '../types';

const prisma = new PrismaClient();

export interface LiquidationQueryOptions {
  symbol?: string;
  limit?: number;
  offset?: number;
}

export async function getLiquidations(options: LiquidationQueryOptions = {}): Promise<Liquidation[]> {
  const cacheKey = `liquidations:${JSON.stringify(options)}`;
  const cacheTTL = parseInt(process.env.CACHE_TTL_LIQUIDATIONS || '60');

  try {
    // Try cache first
    const cached = await getCached<Liquidation[]>(cacheKey);
    if (cached) {
      logger.debug('Returning cached liquidation data');
      return cached;
    }

    // Fetch from database
    const liquidations = await prisma.liquidation.findMany({
      where: options.symbol ? { coinSymbol: options.symbol.toLowerCase() } : undefined,
      orderBy: { timestamp: 'desc' },
      take: options.limit || 50,
      skip: options.offset || 0,
    });

    const result = liquidations.map(l => ({
      id: l.id,
      coinId: l.coinId,
      coinSymbol: l.coinSymbol,
      side: l.side as 'long' | 'short',
      amount: l.amount,
      price: l.price,
      leverage: l.leverage || undefined,
      timestamp: l.timestamp,
    }));

    // Cache the result
    await setCached(cacheKey, result, cacheTTL);

    return result;
  } catch (error: any) {
    logger.error('Error fetching liquidations:', error);
    throw new Error('Failed to fetch liquidation data');
  }
}

export async function getLiquidationChart(symbol: string, timeframe: string = '24h'): Promise<LiquidationChartData[]> {
  const cacheKey = `liquidation-chart:${symbol.toLowerCase()}:${timeframe}`;
  const cacheTTL = parseInt(process.env.CACHE_TTL_LIQUIDATIONS || '60');

  try {
    // Try cache first
    const cached = await getCached<LiquidationChartData[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Calculate time range
    const now = new Date();
    let startTime: Date;
    
    switch (timeframe) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '4h':
        startTime = new Date(now.getTime() - 4 * 60 * 60 * 1000);
        break;
      case '24h':
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
    }

    // Fetch from database
    const chartData = await prisma.liquidationChart.findMany({
      where: {
        coinSymbol: symbol.toLowerCase(),
        timestamp: { gte: startTime },
      },
      orderBy: { price: 'desc' },
    });

    const result = chartData.map(c => ({
      id: c.id,
      coinSymbol: c.coinSymbol,
      price: c.price,
      longAmount: c.longAmount,
      shortAmount: c.shortAmount,
      totalAmount: c.totalAmount,
      timestamp: c.timestamp,
    }));

    // Cache the result
    await setCached(cacheKey, result, cacheTTL);

    return result;
  } catch (error: any) {
    logger.error('Error fetching liquidation chart:', error);
    throw new Error('Failed to fetch liquidation chart data');
  }
}
