// Next.js API Route for Binance 24h Ticker
// 代理 Binance 24小时行情数据，解决 CORS 问题

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  try {
    let binanceUrl;
    if (symbol) {
      // 单个币种
      binanceUrl = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`;
    } else {
      // 所有币种
      binanceUrl = 'https://api.binance.com/api/v3/ticker/24hr';
    }

    const response = await fetch(binanceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
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
    console.error('Proxy Binance 24h ticker error:', error);
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
