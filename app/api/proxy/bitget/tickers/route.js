// Next.js API Route for Bitget Market Data
// 代理 Bitget 市场数据，解决 CORS 问题

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  try {
    let bitgetUrl;
    if (symbol) {
      // 单个交易对
      bitgetUrl = `https://api.bitget.com/api/v2/spot/market/tickers?symbol=${symbol}`;
    } else {
      // 所有交易对
      bitgetUrl = 'https://api.bitget.com/api/v2/spot/market/tickers';
    }

    const response = await fetch(bitgetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Bitget API error: ${response.status} ${response.statusText}`);
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
        'Cache-Control': 'public, max-age=5' // 缓存 5 秒
      }
    });

  } catch (error) {
    console.error('Proxy Bitget ticker error:', error);
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
