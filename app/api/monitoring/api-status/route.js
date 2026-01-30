// API运行状态监控API
export async function GET(request) {
  try {
    // 检查各个API的状态
    const apiStatuses = await checkAllAPIs();

    return new Response(JSON.stringify({
      success: true,
      data: apiStatuses,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('API Status Monitoring Error:', error);
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

// 检查所有API状态
async function checkAllAPIs() {
  const apis = [
    {
      id: 'coingecko-market',
      name: 'CoinGecko市场数据',
      url: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=1',
      category: '市场数据'
    },
    {
      id: 'coingecko-simple',
      name: 'CoinGecko简单价格',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      category: '价格数据'
    },
    {
      id: 'binance-ticker',
      name: 'Binance Ticker',
      url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
      category: '交易数据'
    },
    {
      id: 'binance-klines',
      name: 'Binance K线',
      url: 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=1',
      category: 'K线数据'
    },
    {
      id: 'okx-ticker',
      name: 'OKX Ticker',
      url: 'https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT',
      category: '交易数据'
    },
    {
      id: 'bybit-ticker',
      name: 'Bybit Ticker',
      url: 'https://api.bybit.com/v5/market/tickers?category=spot&symbol=BTCUSDT',
      category: '交易数据'
    },
    {
      id: 'bitget-ticker',
      name: 'Bitget Ticker',
      url: 'https://api.bitget.com/api/spot/v1/market/tickers?symbol=BTCUSDT',
      category: '交易数据'
    },
    {
      id: 'kucoin-ticker',
      name: 'KuCoin Ticker',
      url: 'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=BTC-USDT',
      category: '交易数据'
    }
  ];

  // 并行检查所有API
  const results = await Promise.all(
    apis.map(api => checkAPI(api))
  );

  // 按分类分组
  const grouped = {};
  results.forEach(result => {
    if (!grouped[result.category]) {
      grouped[result.category] = [];
    }
    grouped[result.category].push(result);
  });

  // 计算总体统计
  const total = results.length;
  const healthy = results.filter(r => r.status === 'healthy').length;
  const degraded = results.filter(r => r.status === 'degraded').length;
  const down = results.filter(r => r.status === 'down').length;

  return {
    summary: {
      total,
      healthy,
      degraded,
      down,
      healthPercentage: total > 0 ? ((healthy / total) * 100).toFixed(1) : 0
    },
    apis: grouped,
    lastCheck: new Date().toISOString()
  };
}

// 检查单个API状态
async function checkAPI(api) {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(api.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'HelloYan-Monitor/1.0'
      }
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json();
      return {
        ...api,
        status: 'healthy',
        latency,
        lastCheck: new Date().toISOString(),
        dataSize: JSON.stringify(data).length
      };
    } else {
      return {
        ...api,
        status: 'degraded',
        latency,
        lastCheck: new Date().toISOString(),
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    const latency = Date.now() - startTime;
    return {
      ...api,
      status: 'down',
      latency,
      lastCheck: new Date().toISOString(),
      error: error.message
    };
  }
}
