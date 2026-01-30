'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import type { Market } from '@/app/lib/types';

export function useMarkets(params?: {
  vs_currency?: string;
  per_page?: number;
  page?: number;
  order?: string;
}) {
  return useQuery({
    queryKey: ['markets', params],
    queryFn: () => api.getMarkets(params),
    staleTime: 30000, // 30 seconds
  });
}

export function useMarket(symbol: string) {
  return useQuery({
    queryKey: ['market', symbol],
    queryFn: () => api.getMarketBySymbol(symbol),
    enabled: !!symbol,
  });
}

export function useLiquidations(params?: {
  symbol?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['liquidations', params],
    queryFn: () => api.getLiquidations(params),
    staleTime: 60000, // 1 minute
  });
}

export function useLiquidationChart(symbol: string, timeframe?: string) {
  return useQuery({
    queryKey: ['liquidationChart', symbol, timeframe],
    queryFn: () => api.getLiquidationChart(symbol, timeframe),
    enabled: !!symbol,
    staleTime: 60000, // 1 minute
  });
}

export function useStrategySignals(params?: {
  signal_type?: string;
  limit?: number;
  coin_symbol?: string;
}) {
  return useQuery({
    queryKey: ['strategySignals', params],
    queryFn: () => api.getStrategySignals(params),
    staleTime: 60000, // 1 minute
  });
}

export function useBollingerBands(symbol: string) {
  return useQuery({
    queryKey: ['bollingerBands', symbol],
    queryFn: () => api.getBollingerBands(symbol),
    enabled: !!symbol,
    staleTime: 60000, // 1 minute
  });
}

export function useMultiCoinStrategies() {
  return useQuery({
    queryKey: ['multiCoinStrategies'],
    queryFn: api.getMultiCoinStrategies,
    staleTime: 300000, // 5 minutes
  });
}

export function useNews(params?: {
  limit?: number;
  coin_symbol?: string;
  source?: string;
}) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => api.getNews(params),
    staleTime: 300000, // 5 minutes
  });
}

export function useAnomalies(params?: {
  severity?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['anomalies', params],
    queryFn: () => api.getAnomalies(params),
    staleTime: 60000, // 1 minute
  });
}

export function useApiStatus() {
  return useQuery({
    queryKey: ['apiStatus'],
    queryFn: api.getApiStatus,
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}
