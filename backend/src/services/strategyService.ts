import { PrismaClient } from '@prisma/client';
import { getCached, setCached } from '../utils/redis';
import { logger } from '../utils/logger';
import { StrategySignal, BollingerBands } from '../types';

const prisma = new PrismaClient();

export interface StrategySignalQueryOptions {
  signalType?: string;
  limit?: number;
  coinSymbol?: string;
}

export async function getStrategySignals(options: StrategySignalQueryOptions = {}): Promise<StrategySignal[]> {
  const cacheKey = `strategy-signals:${JSON.stringify(options)}`;
  const cacheTTL = 60;

  try {
    // Try cache first
    const cached = await getCached<StrategySignal[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const signals = await prisma.strategySignal.findMany({
      where: {
        signalType: options.signalType,
        coinSymbol: options.coinSymbol?.toLowerCase(),
      },
      orderBy: { timestamp: 'desc' },
      take: options.limit || 20,
    });

    const result = signals.map(s => ({
      id: s.id,
      coinId: s.coinId,
      coinSymbol: s.coinSymbol,
      signalType: s.signalType as 'buy' | 'sell',
      signalName: s.signalName,
      strength: s.strength,
      reason: s.reason,
      confidence: s.confidence,
      triggerPrice: s.triggerPrice || undefined,
      timestamp: s.timestamp,
    }));

    // Cache the result
    await setCached(cacheKey, result, cacheTTL);

    return result;
  } catch (error: any) {
    logger.error('Error fetching strategy signals:', error);
    throw new Error('Failed to fetch strategy signals');
  }
}

export async function getBollingerBands(symbol: string): Promise<BollingerBands | null> {
  const cacheKey = `bollinger-bands:${symbol.toLowerCase()}`;
  const cacheTTL = 60;

  try {
    // Try cache first
    const cached = await getCached<BollingerBands>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const bands = await prisma.bollingerBands.findFirst({
      where: { coinSymbol: symbol.toLowerCase() },
      orderBy: { timestamp: 'desc' },
    });

    if (!bands) {
      return null;
    }

    const result: BollingerBands = {
      id: bands.id,
      coinId: bands.coinId,
      coinSymbol: bands.coinSymbol,
      upperBand: bands.upperBand,
      middleBand: bands.middleBand,
      lowerBand: bands.lowerBand,
      currentPrice: bands.currentPrice,
      bandwidth: bands.bandwidth,
      timestamp: bands.timestamp,
    };

    // Cache the result
    await setCached(cacheKey, result, cacheTTL);

    return result;
  } catch (error: any) {
    logger.error(`Error fetching Bollinger Bands for ${symbol}:`, error);
    return null;
  }
}

export async function getMultiCoinStrategies() {
  const cacheKey = 'multi-coin-strategies';
  const cacheTTL = 300;

  try {
    const cached = await getCached(cacheKey);
    if (cached) {
      return cached;
    }

    const strategies = await prisma.multiCoinStrategy.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    await setCached(cacheKey, strategies, cacheTTL);

    return strategies;
  } catch (error: any) {
    logger.error('Error fetching multi-coin strategies:', error);
    throw new Error('Failed to fetch multi-coin strategies');
  }
}
