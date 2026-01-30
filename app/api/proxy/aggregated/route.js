// 聚合多个免费 API 数据源
// 提高数据获取成功率

export const runtime = 'nodejs';

// 免费数据源列表
const API_SOURCES = [
  {
    name: 'CoinGecko',
    baseUrl: 'https://api.coingecko.com/api/v3',
    priority: 1
  },
  {
    name: 'CryptoCompare',
    baseUrl: 'https://min-api.cryptocompare.com/data',
    priority: 2
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'markets';
  const vs_currency = searchParams.get('vs_currency') || 'usd';
  const per_page = parseInt(searchParams.get('per_page')) || 50;

  try {
    // 尝试从 CoinGecko 获取数据
    try {
      const coingeckoData = await fetchFromCoinGecko(endpoint, vs_currency, per_page);
      if (coingeckoData && coingeckoData.length > 0) {
        return new Response(JSON.stringify(coingeckoData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=60',
            'X-Data-Source': 'CoinGecko'
          }
        });
      }
    } catch (error) {
      console.log('CoinGecko API failed, trying next source:', error.message);
    }

    // 如果 CoinGecko 失败，尝试从 CryptoCompare 获取数据
    try {
      const cryptocompareData = await fetchFromCryptoCompare(vs_currency, per_page);
      if (cryptocompareData && cryptocompareData.length > 0) {
        return new Response(JSON.stringify(cryptocompareData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=60',
            'X-Data-Source': 'CryptoCompare'
          }
        });
      }
    } catch (error) {
      console.log('CryptoCompare API failed:', error.message);
    }

    // 所有数据源都失败，返回空数组
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
        'X-Data-Source': 'none'
      }
    });

  } catch (error) {
    console.log('Aggregated API error:', error.message);

    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }
}

// 从 CoinGecko 获取数据
async function fetchFromCoinGecko(endpoint, vs_currency, per_page) {
  const url = `https://api.coingecko.com/api/v3/${endpoint}?vs_currency=${vs_currency}&order=market_cap_desc&per_page=${per_page}&page=1&sparkline=false`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    },
    signal: AbortSignal.timeout(12000)
  });

  if (response.ok) {
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  }

  throw new Error('CoinGecko API failed');
}

// 从 CryptoCompare 获取数据
async function fetchFromCryptoCompare(vs_currency, per_page) {
  // 获取前 N 个币种的数据
  const topCoins = await fetch(
    `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=${per_page}&tsym=${vs_currency.toUpperCase()}`,
    {
      signal: AbortSignal.timeout(12000)
    }
  );

  if (topCoins.ok) {
    const data = await topCoins.json();
    if (data && data.Data && Array.isArray(data.Data)) {
      // 转换为标准格式
      return data.Data.map(item => {
        const symbol = item.CoinInfo?.Symbol || item.CoinInfo?.Name || '';
        return {
          id: item.CoinInfo?.Id || '',
          symbol: symbol.toLowerCase(),
          name: item.CoinInfo?.FullName?.split(' ')[0] || symbol,
          current_price: item.RAW?.[vs_currency.toUpperCase()]?.PRICE || 0,
          price_change_percentage_24h: item.RAW?.[vs_currency.toUpperCase()]?.CHANGEPCT24HOUR || 0,
          market_cap: item.RAW?.[vs_currency.toUpperCase()]?.MKTCAP || 0,
          total_volume: item.RAW?.[vs_currency.toUpperCase()]?.TOTALVOLUME24HTO || 0,
          image: item.CoinInfo?.ImageUrl ? `https://www.cryptocompare.com${item.CoinInfo.ImageUrl}` : ''
        };
      });
    }
  }

  throw new Error('CryptoCompare API failed');
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
