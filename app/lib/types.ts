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
  lastUpdated: string;
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
  timestamp: string;
}

export interface LiquidationChartData {
  id: string;
  coinSymbol: string;
  price: number;
  longAmount: number;
  shortAmount: number;
  totalAmount: number;
  timestamp: string;
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
  timestamp: string;
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
  timestamp: string;
}

// News types
export interface News {
  id: string;
  title: string;
  description?: string;
  url: string;
  source: string;
  imageUrl?: string;
  publishedAt: string;
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
  timestamp: string;
}

// API status types
export interface ApiStatus {
  apiName: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastChecked: string;
  errorMessage?: string;
}

// Widget layout types
export interface WidgetLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export interface DashboardLayout {
  widgets: WidgetLayout[];
  theme: 'dark' | 'light';
  autoRefresh: number;
}

// WebSocket message types
export interface WSMessage {
  type: 'price_update' | 'liquidation' | 'signal' | 'anomaly' | 'ping';
  data: any;
  timestamp: string;
}
