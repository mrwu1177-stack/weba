import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { getMarketData } from '../services/marketService';

const prisma = new PrismaClient();

export async function generateStrategySignals() {
  try {
    // Fetch top 20 markets
    const markets = await getMarketData({ per_page: 20 });

    for (const market of markets) {
      // Generate momentum signals
      await generateMomentumSignal(market);

      // Generate Bollinger Bands
      await generateBollingerBands(market);

      // Generate volume spike signals
      await generateVolumeSpikeSignal(market);
    }

    logger.info(`Generated strategy signals for ${markets.length} markets`);
  } catch (error: any) {
    logger.error('Error generating strategy signals:', error);
  }
}

async function generateMomentumSignal(market: any) {
  try {
    const priceChange = market.priceChangePercentage24h;
    const signalType = priceChange > 5 ? 'buy' : priceChange < -5 ? 'sell' : null;

    if (signalType) {
      await prisma.strategySignal.create({
        data: {
          coinId: market.coinId,
          coinSymbol: market.symbol,
          signalType,
          signalName: 'momentum',
          strength: Math.abs(priceChange),
          reason: priceChange > 5 
            ? `Strong momentum: ${priceChange.toFixed(2)}% gain in 24h`
            : `Bearish momentum: ${priceChange.toFixed(2)}% loss in 24h`,
          confidence: Math.min(95, 50 + Math.abs(priceChange) * 5),
          triggerPrice: market.currentPrice,
          timestamp: new Date(),
        },
      });
    }
  } catch (error) {
    logger.error('Error generating momentum signal:', error);
  }
}

async function generateBollingerBands(market: any) {
  try {
    const price = market.currentPrice;
    const volatility = Math.abs(market.priceChangePercentage24h) / 2;
    
    const upperBand = price * (1 + volatility / 100);
    const lowerBand = price * (1 - volatility / 100);
    const middleBand = (upperBand + lowerBand) / 2;
    const bandwidth = ((upperBand - lowerBand) / middleBand) * 100;

    await prisma.bollingerBands.upsert({
      where: {
        id: `${market.coinId}-${Date.now()}`,
      },
      update: {},
      create: {
        id: `${market.coinId}-${Date.now()}`,
        coinId: market.coinId,
        coinSymbol: market.symbol,
        upperBand,
        middleBand,
        lowerBand,
        currentPrice: price,
        bandwidth,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    logger.error('Error generating Bollinger Bands:', error);
  }
}

async function generateVolumeSpikeSignal(market: any) {
  try {
    const volume24h = market.volume24h;
    const marketCap = market.marketCap;
    const volumeRatio = volume24h / marketCap;

    // Volume spike: 24h volume > 5% of market cap
    if (volumeRatio > 0.05) {
      await prisma.strategySignal.create({
        data: {
          coinId: market.coinId,
          coinSymbol: market.symbol,
          signalType: 'buy',
          signalName: 'volume_spike',
          strength: volumeRatio * 100,
          reason: `Volume spike detected: ${(volumeRatio * 100).toFixed(2)}% of market cap`,
          confidence: 70,
          triggerPrice: market.currentPrice,
          timestamp: new Date(),
        },
      });
    }
  } catch (error) {
    logger.error('Error generating volume spike signal:', error);
  }
}
