// 策略分析监控API
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // 获取策略监控数据
    const strategyData = await getStrategyMonitoringData();

    if (type === 'all') {
      return new Response(JSON.stringify({
        success: true,
        data: strategyData,
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } else {
      // 返回特定策略的数据
      const specificData = strategyData[type];
      return new Response(JSON.stringify({
        success: true,
        data: specificData,
        timestamp: new Date().toISOString()
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
  } catch (error) {
    console.error('Strategy Monitoring API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// 获取策略监控数据
async function getStrategyMonitoringData() {
  // 获取异动信号数据
  const signalData = await getSignalData();

  // 获取多币种策略数据
  const multicoinData = await getMulticoinData();

  // 获取布林带分析数据
  const bollingerData = await getBollingerData();

  return {
    signal: signalData,
    multicoin: multicoinData,
    bollinger: bollingerData
  };
}

// 异动信号数据
async function getSignalData() {
  try {
    // 从聚合API获取数据
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&order=market_cap_desc', {
      signal: AbortSignal.timeout(10000)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        status: 'active',
        lastUpdate: new Date().toISOString(),
        dataPoints: data.length,
        signals: generateMockSignals(data),
        apiSource: 'coingecko',
        apiLatency: Math.floor(Math.random() * 500) + 200 // 模拟延迟
      };
    }
  } catch (error) {
    console.error('Signal data fetch error:', error);
  }

  // 返回降级数据
  return {
    status: 'error',
    lastUpdate: new Date().toISOString(),
    dataPoints: 5,
    signals: [],
    apiSource: 'fallback',
    apiLatency: 0,
    error: 'API请求失败，使用备用数据'
  };
}

// 多币种策略数据
async function getMulticoinData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&order=market_cap_desc', {
      signal: AbortSignal.timeout(10000)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        status: 'active',
        lastUpdate: new Date().toISOString(),
        dataPoints: data.length,
        strategies: generateMockStrategies(data),
        apiSource: 'coingecko',
        apiLatency: Math.floor(Math.random() * 500) + 200
      };
    }
  } catch (error) {
    console.error('Multicoin data fetch error:', error);
  }

  return {
    status: 'error',
    lastUpdate: new Date().toISOString(),
    dataPoints: 3,
    strategies: [],
    apiSource: 'fallback',
    apiLatency: 0,
    error: 'API请求失败，使用备用数据'
  };
}

// 布林带分析数据
async function getBollingerData() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&order=market_cap_desc', {
      signal: AbortSignal.timeout(10000)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        status: 'active',
        lastUpdate: new Date().toISOString(),
        dataPoints: data.length,
        analysis: generateMockBollinger(data),
        apiSource: 'coingecko',
        apiLatency: Math.floor(Math.random() * 500) + 200
      };
    }
  } catch (error) {
    console.error('Bollinger data fetch error:', error);
  }

  return {
    status: 'error',
    lastUpdate: new Date().toISOString(),
    dataPoints: 4,
    analysis: [],
    apiSource: 'fallback',
    apiLatency: 0,
    error: 'API请求失败，使用备用数据'
  };
}

// 生成模拟信号数据
function generateMockSignals(data) {
  const coins = Array.isArray(data) ? data.slice(0, 5) : [];
  return coins.map(coin => ({
    coin: coin.symbol?.toUpperCase() || 'BTC',
    icon: '🚀',
    type: (coin.price_change_percentage_24h || 0) > 0 ? 'buy' : 'sell',
    action: (coin.price_change_percentage_24h || 0) > 0 ? '买入信号' : '卖出信号',
    reason: (coin.price_change_percentage_24h || 0) > 0 ? '突破关键阻力位' : '跌破支撑位',
    price: (coin.current_price || 0).toFixed(2),
    strength: Math.floor(Math.random() * 100)
  }));
}

// 生成模拟策略数据
function generateMockStrategies(data) {
  return [
    {
      name: '均值回归策略',
      description: '利用价格偏离均值后的回归特性',
      return: '+15.2%',
      coins: ['BTC', 'ETH', 'BNB'],
      status: 'active'
    },
    {
      name: '动量跟随策略',
      description: '追踪市场趋势，顺势而为',
      return: '+22.8%',
      coins: ['SOL', 'AVAX', 'MATIC'],
      status: 'active'
    },
    {
      name: '套利策略',
      description: '跨交易所价格差异套利',
      return: '+8.5%',
      coins: ['USDT', 'USDC'],
      status: 'active'
    }
  ];
}

// 生成模拟布林带数据
function generateMockBollinger(data) {
  const coins = Array.isArray(data) ? data.slice(0, 4) : [];
  return coins.map(coin => {
    const price = coin.current_price || 0;
    const upper = price * 1.05;
    const lower = price * 0.95;
    const position = price > 0 ? ((price - lower) / (upper - lower) * 100).toFixed(0) : '50';

    return {
      coin: coin.symbol?.toUpperCase() || 'BTC',
      upper: upper.toFixed(2),
      lower: lower.toFixed(2),
      current: price.toFixed(2),
      position: position + '%',
      signal: position > 80 ? '强烈卖出' : position < 20 ? '强烈买入' : '持有',
      status: 'active'
    };
  });
}
