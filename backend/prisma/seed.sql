-- Seed data for HelloYan database

-- Insert sample market data
INSERT INTO "Market" ("coinId", "symbol", "name", "currentPrice", "priceChange24h", "priceChangePercentage24h", "marketCap", "marketCapRank", "volume24h", "high24h", "low24h", "circulatingSupply", "totalSupply", "maxSupply", "lastUpdated") VALUES
('bitcoin', 'btc', 'Bitcoin', 43500.50, 1250.30, 2.96, 850000000000, 1, 28500000000, 44000.00, 42000.00, 19500000, 21000000, 21000000, NOW()),
('ethereum', 'eth', 'Ethereum', 2280.75, 85.20, 3.88, 275000000000, 2, 12500000000, 2350.00, 2180.00, 120000000, 120000000, NULL, NOW()),
('binancecoin', 'bnb', 'BNB', 310.25, 5.80, 1.91, 48000000000, 3, 1200000000, 315.00, 302.00, 150000000, 200000000, 200000000, NOW()),
('solana', 'sol', 'Solana', 98.50, 4.20, 4.45, 42000000000, 4, 2500000000, 102.00, 94.00, 420000000, 550000000, NULL, NOW()),
('ripple', 'xrp', 'XRP', 0.52, 0.02, 4.00, 28000000000, 5, 1800000000, 0.54, 0.49, 54000000000, 100000000000, 100000000000, NOW()),
('cardano', 'ada', 'Cardano', 0.45, 0.015, 3.45, 16000000000, 6, 450000000, 0.47, 0.43, 35000000000, 45000000000, 45000000000, NOW()),
('dogecoin', 'doge', 'Dogecoin', 0.082, 0.003, 3.80, 11500000000, 7, 800000000, 0.085, 0.078, 140000000000, NULL, NULL, NOW()),
('polkadot', 'dot', 'Polkadot', 6.85, 0.25, 3.78, 9000000000, 8, 280000000, 7.10, 6.60, 1300000000, 1400000000, 1400000000, NOW());

-- Insert sample liquidation data
INSERT INTO "Liquidation" ("coinId", "coinSymbol", "side", "amount", "price", "leverage", "timestamp") VALUES
('bitcoin', 'btc', 'long', 2.5, 43200, 25, NOW() - INTERVAL '5 minutes'),
('bitcoin', 'btc', 'short', 1.8, 43800, 20, NOW() - INTERVAL '10 minutes'),
('ethereum', 'eth', 'long', 15.0, 2260, 10, NOW() - INTERVAL '3 minutes'),
('ethereum', 'eth', 'short', 8.5, 2300, 15, NOW() - INTERVAL '8 minutes'),
('solana', 'sol', 'long', 120.0, 96.5, 5, NOW() - INTERVAL '2 minutes'),
('binancecoin', 'bnb', 'short', 45.0, 312, 10, NOW() - INTERVAL '15 minutes');

-- Insert sample liquidation chart data
INSERT INTO "LiquidationChart" ("coinSymbol", "price", "longAmount", "shortAmount", "totalAmount", "timestamp") VALUES
('btc', 44000, 12500000, 8500000, 21000000, NOW() - INTERVAL '1 hour'),
('btc', 43500, 8500000, 12000000, 20500000, NOW()),
('btc', 43000, 15000000, 6000000, 21000000, NOW() - INTERVAL '30 minutes'),
('eth', 2350, 4500000, 3200000, 7700000, NOW() - INTERVAL '1 hour'),
('eth', 2280, 3800000, 4500000, 8300000, NOW());

-- Insert sample strategy signals
INSERT INTO "StrategySignal" ("coinId", "coinSymbol", "signalType", "signalName", "strength", "reason", "confidence", "triggerPrice", "timestamp") VALUES
('bitcoin', 'btc', 'buy', 'momentum', 7.5, 'Strong momentum detected with 2.96% gain in 24h', 85, 43500, NOW() - INTERVAL '30 minutes'),
('ethereum', 'eth', 'buy', 'momentum', 6.2, 'Bullish momentum with 3.88% increase', 78, 2280, NOW() - INTERVAL '1 hour'),
('solana', 'sol', 'buy', 'volume_spike', 8.5, 'Volume spike detected: 5.95% of market cap', 88, 98.5, NOW() - INTERVAL '2 hours'),
('cardano', 'ada', 'sell', 'momentum', 5.8, 'Bearish divergence on 4H timeframe', 72, 0.45, NOW() - INTERVAL '3 hours'),
('ripple', 'xrp', 'buy', 'breakout', 6.8, 'Breakout above key resistance at $0.50', 80, 0.52, NOW() - INTERVAL '4 hours');

-- Insert sample Bollinger Bands data
INSERT INTO "BollingerBands" ("coinId", "coinSymbol", "upperBand", "middleBand", "lowerBand", "currentPrice", "bandwidth", "timestamp") VALUES
('bitcoin', 'btc', 44800, 43500, 42200, 43500.50, 6.02, NOW()),
('ethereum', 'eth', 2350, 2280, 2210, 2280.75, 6.14, NOW()),
('solana', 'sol', 102, 98.5, 95, 98.5, 7.14, NOW()),
('binancecoin', 'bnb', 320, 310, 300, 310.25, 6.45, NOW());

-- Insert sample multi-coin strategies
INSERT INTO "MultiCoinStrategy" ("name", "description", "coins", "parameters", "performance", "isActive", "createdAt", "updatedAt") VALUES
('Top 3 Momentum', 'Track top 3 coins by momentum', '["btc", "eth", "sol"]', '{"lookback": 24, "threshold": 3}', '{"total_return": 0.15, "max_drawdown": -0.08, "sharpe_ratio": 2.1}', true, NOW() - INTERVAL '7 days', NOW()),
('Diversified Portfolio', 'Balanced portfolio across top 5 coins', '["btc", "eth", "bnb", "sol", "ada"]', '{"allocation": "equal", "rebalance": "weekly"}', '{"total_return": 0.12, "max_drawdown": -0.06, "sharpe_ratio": 1.8}', true, NOW() - INTERVAL '14 days', NOW());

-- Insert sample news
INSERT INTO "News" ("title", "description", "url", "source", "publishedAt", "coins") VALUES
('Bitcoin Surges Past $43,000 as Institutional Interest Grows', 'Bitcoin continues its rally as more institutions show interest in cryptocurrency adoption.', 'https://example.com/news1', 'Coindesk', NOW() - INTERVAL '2 hours', '["btc"]'),
('Ethereum 2.0 Upgrade on Track for Q1 2026', 'The next major upgrade to the Ethereum network is scheduled for early 2026.', 'https://example.com/news2', 'Cointelegraph', NOW() - INTERVAL '5 hours', '["eth"]'),
('Solana Network Reaches New High in Daily Transactions', 'Solana continues to lead in transaction volume, processing over 100 million transactions daily.', 'https://example.com/news3', 'Decrypt', NOW() - INTERVAL '8 hours', '["sol"]');

-- Insert sample market anomalies
INSERT INTO "MarketAnomaly" ("coinId", "coinSymbol", "type", "severity", "description", "metadata", "timestamp") VALUES
('dogecoin', 'doge', 'volume_spike', 'medium', 'Unusual volume spike detected', '{"volume_ratio": 3.5, "normal_volume": 500000000}', NOW() - INTERVAL '1 hour'),
('cardano', 'ada', 'price_pump', 'low', 'Sudden price movement detected', '{"change_1h": 5.2}', NOW() - INTERVAL '2 hours'),
('polkadot', 'dot', 'whale_activity', 'medium', 'Large whale transfer detected', '{"amount": 500000, "from_address": "unknown"}', NOW() - INTERVAL '3 hours');

-- Insert API status data
INSERT INTO "ApiStatus" ("apiName", "status", "latency", "lastChecked") VALUES
('CoinGecko', 'healthy', 245, NOW()),
('Binance', 'healthy', 89, NOW()),
('OKX', 'healthy', 156, NOW()),
('Bybit', 'healthy', 178, NOW()),
('Bitget', 'degraded', 890, NOW()),
('KuCoin', 'healthy', 234, NOW());

-- Insert system logs
INSERT INTO "SystemLog" ("level", "module", "message", "timestamp") VALUES
('info', 'market', 'Successfully fetched 50 markets from CoinGecko', NOW() - INTERVAL '1 minute'),
('info', 'liquidation', 'Processed 15 new liquidation records', NOW() - INTERVAL '5 minutes'),
('warn', 'api', 'Bitget API response time elevated: 890ms', NOW() - INTERVAL '10 minutes'),
('info', 'strategy', 'Generated 5 new strategy signals', NOW() - INTERVAL '30 minutes'),
('error', 'cache', 'Failed to update cache for key: markets:default', NOW() - INTERVAL '1 hour');
