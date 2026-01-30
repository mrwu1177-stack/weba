// Next.js API Route for CoinGecko API
// 代理 CoinGecko 加密货币市场数据，解决 CORS 问题

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'coins/markets';
  
  try {
    // CoinGecko API 基础 URL
    let coingeckoUrl = `https://api.coingecko.com/api/v3/${endpoint}`;
    
    // 添加查询参数
    const params = [];
    if (searchParams.get('vs_currency')) params.push(`vs_currency=${searchParams.get('vs_currency')}`);
    if (searchParams.get('order')) params.push(`order=${searchParams.get('order')}`);
    if (searchParams.get('per_page')) params.push(`per_page=${searchParams.get('per_page')}`);
    if (searchParams.get('page')) params.push(`page=${searchParams.get('page')}`);
    if (searchParams.get('sparkline')) params.push(`sparkline=${searchParams.get('sparkline')}`);
    if (searchParams.get('price_change_percentage')) params.push(`price_change_percentage=${searchParams.get('price_change_percentage')}`);
    
    if (params.length > 0) {
      coingeckoUrl += '?' + params.join('&');
    }
    
    const response = await fetch(coingeckoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 返回数据，启用 CORS
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=30' // 缓存 30 秒
      }
    });

  } catch (error) {
    console.error('Proxy CoinGecko error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 支持 OPTIONS 请求（CORS 预检）
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
