// 备用数据 API - 当外部 API 无法访问时使用
// 返回模拟数据，确保网站可以正常显示

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dataType = searchParams.get('type') || 'market';

  const mockData = {
    market: [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 97245.50,
        price_change_percentage_24h: 2.45,
        market_cap: 1900000000000,
        total_volume: 35000000000,
        image: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png'
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 3245.80,
        price_change_percentage_24h: 1.82,
        market_cap: 390000000000,
        total_volume: 18000000000,
        image: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png'
      },
      {
        id: 'binancecoin',
        symbol: 'bnb',
        name: 'BNB',
        current_price: 628.45,
        price_change_percentage_24h: -0.65,
        market_cap: 95000000000,
        total_volume: 1200000000,
        image: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png'
      },
      {
        id: 'solana',
        symbol: 'sol',
        name: 'Solana',
        current_price: 182.30,
        price_change_percentage_24h: 5.21,
        market_cap: 85000000000,
        total_volume: 3200000000,
        image: 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png'
      },
      {
        id: 'ripple',
        symbol: 'xrp',
        name: 'XRP',
        current_price: 2.85,
        price_change_percentage_24h: 3.12,
        market_cap: 160000000000,
        total_volume: 2500000000,
        image: 'https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png'
      }
    ],
    news: [
      {
        title: '比特币突破关键阻力位，市场情绪转暖',
        time: '10分钟前',
        source: 'CoinDesk'
      },
      {
        title: '以太坊2.0质押量创历史新高',
        time: '25分钟前',
        source: 'Decrypt'
      },
      {
        title: 'DeFi总锁仓量回升至500亿美元',
        time: '1小时前',
        source: 'DeFi Pulse'
      },
      {
        title: 'USDC发行方Circle获银行牌照',
        time: '2小时前',
        source: 'CoinTelegraph'
      },
      {
        title: '币安上线新的永续合约交易对',
        time: '3小时前',
        source: 'Binance'
      }
    ],
    signals: [
      {
        symbol: 'BTC',
        action: '买入',
        price: 97245,
        reason: '突破关键阻力位'
      },
      {
        symbol: 'ETH',
        action: '持有',
        price: 3245,
        reason: '震荡整理'
      },
      {
        symbol: 'SOL',
        action: '买入',
        price: 182,
        reason: '量价齐升'
      }
    ]
  };

  const data = mockData[dataType] || [];

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=60'
    }
  });
}
