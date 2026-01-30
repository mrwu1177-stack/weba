import { PrismaClient } from '@prisma/client';
import { getCached, setCached } from '../utils/redis';
import { logger } from '../utils/logger';
import axios from 'axios';
import { Market } from '../types';

const prisma = new PrismaClient();

export interface MarketQueryOptions {
  vsCurrency?: string;
  perPage?: number;
  page?: number;
  order?: string;
}

export async function getMarketData(options: MarketQueryOptions = {}): Promise<Market[]> {
  const cacheKey = `markets:${JSON.stringify(options)}`;
  const cacheTTL = parseInt(process.env.CACHE_TTL_MARKETS || '30');

  try {
    // Try cache first
    const cached = await getCached<Market[]>(cacheKey);
    if (cached) {
      logger.debug('Returning cached market data');
      return cached;
    }

    // Fetch from CoinGecko
    const { vs_currency = 'usd', per_page = 50, page = 1, order = 'market_cap_desc' } = options;
    const url = `https://api.coingecko.com/api/v3/coins/markets`;
    
    const params = {
      vs_currency,
      per_page,
      page,
      order,
      sparkline: false,
    };

    // Add API key if available
    const headers: any = {};
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-pro-api-key'] = process.env.COINGECKO_API_KEY;
    }

    const response = await axios.get(url, { params, headers });
    const data = response.data;

    // Transform and save to database
    const markets: Market[] = data.map((item: any) => ({
      id: item.id,
      coinId: item.id,
      symbol: item.symbol,
      name: item.name,
      currentPrice: item.current_price,
      priceChange24h: item.price_change_24h,
      priceChangePercentage24h: item.price_change_percentage_24h,
      marketCap: item.market_cap,
      marketCapRank: item.market_cap_rank,
      volume24h: item.total_volume,
      high24h: item.high_24h,
      low24h: item.low_24h,
      circulatingSupply: item.circulating_supply,
      totalSupply: item.total_supply,
      maxSupply: item.max_supply,
      lastUpdated: new Date(item.last_updated),
    }));

    // Save to database (upsert)
    await saveMarketsToDatabase(markets);

    // Cache the result
    await setCached(cacheKey, markets, cacheTTL);

    return markets;
  } catch (error: any) {
    logger.error('Error fetching market data:', error);

    // Fallback to database
    try {
      const dbMarkets = await prisma.market.findMany({
        orderBy: { marketCapRank: 'asc' },
        take: options.perPage || 50,
      });
      
      return dbMarkets.map(m => ({
        id: m.id,
        coinId: m.coinId,
        symbol: m.symbol,
        name: m.name,
        currentPrice: m.currentPrice,
        priceChange24h: m.priceChange24h,
        priceChangePercentage24h: m.priceChangePercentage24h,
        marketCap: m.marketCap,
        marketCapRank: m.marketCapRank,
        volume24h: m.volume24h,
        high24h: m.high24h,
        low24h: m.low24h,
        circulatingSupply: m.circulatingSupply || undefined,
        totalSupply: m.totalSupply || undefined,
        maxSupply: m.maxSupply || undefined,
        lastUpdated: m.lastUpdated,
      }));
    } catch (dbError) {
      logger.error('Error fetching from database:', dbError);
      throw new Error('Failed to fetch market data from all sources');
    }
  }
}

export async function getMarketBySymbol(symbol: string): Promise<Market | null> {
  const cacheKey = `market:${symbol.toLowerCase()}`;
  const cacheTTL = parseInt(process.env.CACHE_TTL_MARKETS || '30');

  try {
    // Try cache first
    const cached = await getCached<Market>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from database
    const market = await prisma.market.findFirst({
      where: { symbol: symbol.toLowerCase() },
    });

    if (!market) {
      return null;
    }

    const result: Market = {
      id: market.id,
      coinId: market.coinId,
      symbol: market.symbol,
      name: market.name,
      currentPrice: market.currentPrice,
      priceChange24h: market.priceChange24h,
      priceChangePercentage24h: market.priceChangePercentage24h,
      marketCap: market.marketCap,
      marketCapRank: market.marketCapRank,
      volume24h: market.volume24h,
      high24h: market.high24h,
      low24h: market.low24h,
      circulatingSupply: market.circulatingSupply || undefined,
      totalSupply: market.totalSupply || undefined,
      maxSupply: market.maxSupply || undefined,
      lastUpdated: market.lastUpdated,
    };

    // Cache the result
    await setCached(cacheKey, result, cacheTTL);

    return result;
  } catch (error: any) {
    logger.error(`Error fetching market ${symbol}:`, error);
    return null;
  }
}

async function saveMarketsToDatabase(markets: Market[]): Promise<void> {
  try {
    for (const market of markets) {
      await prisma.market.upsert({
        where: { coinId: market.coinId },
        update: {
          currentPrice: market.currentPrice,
          priceChange24h: market.priceChange24h,
          priceChangePercentage24h: market.priceChangePercentage24h,
          marketCap: market.marketCap,
          marketCapRank: market.marketCapRank,
          volume24h: market.volume24h,
          high24h: market.high24h,
          low24h: market.low24h,
          circulatingSupply: market.circulatingSupply,
          totalSupply: market.totalSupply,
          maxSupply: market.maxSupply,
          lastUpdated: market.lastUpdated,
        },
        create: {
          coinId: market.coinId,
          symbol: market.symbol.toLowerCase(),
          name: market.name,
          currentPrice: market.currentPrice,
          priceChange24h: market.priceChange24h,
          priceChangePercentage24h: market.priceChangePercentage24h,
          marketCap: market.marketCap,
          marketCapRank: market.marketCapRank,
          volume24h: market.volume24h,
          high24h: market.high24h,
          low24h: market.low24h,
          circulatingSupply: market.circulatingSupply,
          totalSupply: market.totalSupply,
          maxSupply: market.maxSupply,
        },
      });
    }
    logger.info(`Saved ${markets.length} markets to database`);
  } catch (error: any) {
    logger.error('Error saving markets to database:', error);
    // Don't throw, as this is not critical
  }
}
