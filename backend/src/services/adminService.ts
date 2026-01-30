import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import axios from 'axios';

const prisma = new PrismaClient();

export interface ApiStatus {
  apiName: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastChecked: Date;
  errorMessage?: string;
}

export async function getApiStatus(): Promise<ApiStatus[]> {
  try {
    const apis = await prisma.apiStatus.findMany({
      orderBy: { lastChecked: 'desc' },
    });

    return apis.map(api => ({
      apiName: api.apiName,
      status: api.status as any,
      latency: api.latency,
      lastChecked: api.lastChecked,
      errorMessage: api.errorMessage || undefined,
    }));
  } catch (error: any) {
    logger.error('Error fetching API status:', error);
    return [];
  }
}

export async function updateApiConfig(apiName: string, config: { apiKey: string; apiSecret?: string }): Promise<void> {
  try {
    // TODO: Store API configuration securely (e.g., encrypted)
    logger.info(`Updated API configuration for ${apiName}`);
  } catch (error: any) {
    logger.error(`Error updating API configuration for ${apiName}:`, error);
    throw error;
  }
}

export async function checkApiHealth(apiName: string, url: string): Promise<ApiStatus> {
  const startTime = Date.now();

  try {
    const response = await axios.get(url, { timeout: 5000 });
    const latency = Date.now() - startTime;

    const status: 'healthy' | 'degraded' | 'down' = 
      latency < 1000 ? 'healthy' : 
      latency < 3000 ? 'degraded' : 'down';

    await prisma.apiStatus.upsert({
      where: { apiName },
      update: {
        status,
        latency,
        lastChecked: new Date(),
        errorMessage: null,
      },
      create: {
        apiName,
        status,
        latency,
        lastChecked: new Date(),
      },
    });

    return {
      apiName,
      status,
      latency,
      lastChecked: new Date(),
    };
  } catch (error: any) {
    const latency = Date.now() - startTime;
    const errorMessage = error.message || 'Unknown error';

    await prisma.apiStatus.upsert({
      where: { apiName },
      update: {
        status: 'down',
        latency,
        lastChecked: new Date(),
        errorMessage,
      },
      create: {
        apiName,
        status: 'down',
        latency,
        lastChecked: new Date(),
        errorMessage,
      },
    });

    return {
      apiName,
      status: 'down',
      latency,
      lastChecked: new Date(),
      errorMessage,
    };
  }
}
