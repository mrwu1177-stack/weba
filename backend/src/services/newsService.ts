import { PrismaClient } from '@prisma/client';
import { getCached, setCached } from '../utils/redis';
import { logger } from '../utils/logger';
import axios from 'axios';
import { News } from '../types';

const prisma = new PrismaClient();

export interface NewsQueryOptions {
  limit?: number;
  coinSymbol?: string;
  source?: string;
}

export async function getNews(options: NewsQueryOptions = {}): Promise<News[]> {
  const cacheKey = `news:${JSON.stringify(options)}`;
  const cacheTTL = parseInt(process.env.CACHE_TTL_NEWS || '300');

  try {
    // Try cache first
    const cached = await getCached<News[]>(cacheKey);
    if (cached) {
      logger.debug('Returning cached news data');
      return cached;
    }

    // Fetch from CoinGecko
    const url = 'https://api.coingecko.com/api/v3/news';
    const per_page = options.limit || 20;

    const headers: any = {};
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-pro-api-key'] = process.env.COINGECKO_API_KEY;
    }

    const response = await axios.get(url, { 
      params: { per_page },
      headers,
    });

    const data = response.data;

    // Transform and save to database
    const newsItems: News[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description || undefined,
      url: item.url,
      source: item.thumb || 'unknown',
      imageUrl: item.thumb || undefined,
      publishedAt: new Date(item.published_at),
      coins: [],
    }));

    // Cache the result
    await setCached(cacheKey, newsItems, cacheTTL);

    return newsItems;
  } catch (error: any) {
    logger.error('Error fetching news:', error);
    
    // Fallback to database
    try {
      const dbNews = await prisma.news.findMany({
        orderBy: { publishedAt: 'desc' },
        take: options.limit || 20,
      });

      return dbNews.map(n => ({
        id: n.id,
        title: n.title,
        description: n.description || undefined,
        url: n.url,
        source: n.source,
        imageUrl: n.imageUrl || undefined,
        publishedAt: n.publishedAt,
        coins: n.coins,
      }));
    } catch (dbError) {
      logger.error('Error fetching news from database:', dbError);
      throw new Error('Failed to fetch news from all sources');
    }
  }
}
