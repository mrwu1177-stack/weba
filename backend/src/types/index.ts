// Market types
export interface Market {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  marketCapRank: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  circulatingSupply?: number;
  totalSupply?: number;
  maxSupply?: number;
  lastUpdated: Date;
}

// Liquidation types
export interface Liquidation {
  id: string;
  coinId: string;
  coinSymbol: string;
  side: 'long' | 'short';
  amount: number;
  price: number;
  leverage?: number;
  timestamp: Date;
}

export interface LiquidationChartData {
  coinSymbol: string;
  price: number;
  longAmount: number;
  shortAmount: number;
  totalAmount: number;
  timestamp: Date;
}

// Strategy signal types
export interface StrategySignal {
  id: string;
  coinId: string;
  coinSymbol: string;
  signalType: 'buy' | 'sell';
  signalName: string;
  strength: number;
  reason: string;
  confidence: number;
  triggerPrice?: number;
  timestamp: Date;
}

export interface BollingerBands {
  id: string;
  coinId: string;
  coinSymbol: string;
  upperBand: number;
  middleBand: number;
  lowerBand: number;
  currentPrice: number;
  bandwidth: number;
  timestamp: Date;
}

// News types
export interface News {
  id: string;
  title: string;
  description?: string;
  url: string;
  source: string;
  imageUrl?: string;
  publishedAt: Date;
  coins: string[];
}

// Market anomaly types
export interface MarketAnomaly {
  id: string;
  coinId: string;
  coinSymbol: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    cached: boolean;
    requestId: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: number;
    requestId: string;
    timestamp: string;
  };
}

// Cache types
export interface CacheConfig {
  key: string;
  ttl: number;
}

// Service response types
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  fromCache?: boolean;
}

// WebSocket message types
export interface WSMessage {
  type: 'price_update' | 'liquidation' | 'signal' | 'anomaly' | 'ping';
  data: any;
  timestamp: string;
}

export interface PriceUpdate {
  coinId: string;
  symbol: string;
  price: number;
  change24h: number;
}
