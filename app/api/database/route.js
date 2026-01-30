// API路由：获取加密货币市场数据
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'market';
    const coin = searchParams.get('coin') || 'BTC';

    let data = [];

    // 根据类型返回不同数据
    switch (type) {
      case 'market':
        // 市场数据
        data = await getMarketData();
        break;
      case 'ranking':
        // 排行榜数据
        const sortBy = searchParams.get('sort') || 'top';
        data = await getRankingData(sortBy);
        break;
      case 'anomaly':
        // 市场异动数据
        const anomalyType = searchParams.get('anomalyType') || 'liquidation';
        data = await getAnomalyData(anomalyType);
        break;
      case 'liquidation':
        // 清算数据
        data = await getLiquidationData(coin);
        break;
      default:
        data = await getMarketData();
    }

    return new Response(JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
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

// 获取市场数据
async function getMarketData() {
  // 这里可以从外部API获取真实数据
  // 暂时返回模拟数据
  return [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      current_price: 97234.5,
      market_cap: 1900000000000,
      market_cap_rank: 1,
      total_volume: 28500000000,
      price_change_percentage_24h: 2.34,
      circulating_supply: 19500000
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      current_price: 3245.8,
      market_cap: 390000000000,
      market_cap_rank: 2,
      total_volume: 15200000000,
      price_change_percentage_24h: 3.15,
      circulating_supply: 120000000
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      current_price: 218.75,
      market_cap: 95000000000,
      market_cap_rank: 5,
      total_volume: 5800000000,
      price_change_percentage_24h: 5.67,
      circulating_supply: 435000000
    }
  ];
}

// 获取排行榜数据
async function getRankingData(sortBy) {
  const marketData = await getMarketData();

  let sortedData = [...marketData];
  switch (sortBy) {
    case 'top':
      sortedData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      break;
    case 'bottom':
      sortedData.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
      break;
    case 'active':
      sortedData.sort((a, b) => b.total_volume - a.total_volume);
      break;
    default:
      sortedData.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
  }

  return sortedData;
}

// 获取市场异动数据
async function getAnomalyData(anomalyType) {
  switch (anomalyType) {
    case 'liquidation':
      return [
        { coin: 'BTC/USDT', type: 'long', amount: '$2.5M', price: '$97,234.50', time: '2026-01-30 12:05:32' },
        { coin: 'ETH/USDT', type: 'short', amount: '$1.8M', price: '$3,245.80', time: '2026-01-30 12:03:15' },
        { coin: 'SOL/USDT', type: 'long', amount: '$850K', price: '$218.75', time: '2026-01-30 12:01:48' }
      ];
    case 'whale':
      return [
        { coin: 'BTC', amount: '500 BTC', value: '$48.6M', type: 'inflow', time: '12:05:45', exchange: 'Binance' },
        { coin: 'ETH', amount: '5,000 ETH', value: '$16.2M', type: 'outflow', time: '12:03:28', exchange: 'OKX' }
      ];
    case 'funding':
      return [
        { coin: 'BTC/USDT', rate: '0.0100%', predict: '0.0095%', status: 'positive', next: '08:00:00' },
        { coin: 'ETH/USDT', rate: '0.0120%', predict: '0.0118%', status: 'positive', next: '08:00:00' }
      ];
    default:
      return [];
  }
}

// 获取清算数据
async function getLiquidationData(coin) {
  // 获取实时价格
  let basePrice = 0;

  try {
    // 尝试从Binance获取价格
    const binanceResponse = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${coin}USDT`);
    if (binanceResponse.ok) {
      const binanceData = await binanceResponse.json();
      basePrice = parseFloat(binanceData.price);
    } else {
      // 备选：使用固定价格
      basePrice = coin === 'BTC' ? 97234.5 : coin === 'ETH' ? 3245.8 : 100;
    }
  } catch (error) {
    // 使用默认价格
    basePrice = coin === 'BTC' ? 97234.5 : coin === 'ETH' ? 3245.8 : 100;
  }

  // 生成清算分布数据
  const leverages = ['5x', '10x', '25x', '50x', '75x', '100x'];
  const priceRange = {
    min: basePrice * 0.85,
    max: basePrice * 1.15,
    current: basePrice
  };

  const leverageData = {};

  leverages.forEach(leverage => {
    const leverageMultiplier = parseInt(leverage);
    const prices = [];
    const longPositions = [];
    const shortPositions = [];

    // 生成价格点
    const step = (priceRange.max - priceRange.min) / 50;

    for (let i = 0; i <= 50; i++) {
      const price = priceRange.min + (step * i);
      prices.push(price);

      // 计算持仓量（模拟）
      const distanceFromCurrent = Math.abs(price - basePrice) / basePrice;

      // 多头持仓：价格越低，清算压力越大
      if (price < basePrice) {
        const longPressure = Math.max(0, 1 - distanceFromCurrent * leverageMultiplier * 0.8);
        longPositions.push(longPressure * (100 + Math.random() * 50));
      } else {
        longPositions.push(Math.random() * 20);
      }

      // 空头持仓：价格越高，清算压力越大
      if (price > basePrice) {
        const shortPressure = Math.max(0, 1 - distanceFromCurrent * leverageMultiplier * 0.8);
        shortPositions.push(shortPressure * (100 + Math.random() * 50));
      } else {
        shortPositions.push(Math.random() * 20);
      }
    }

    leverageData[leverage] = {
      prices,
      longPositions,
      shortPositions
    };
  });

  return {
    coin,
    priceRange,
    leverageData
  };
}
