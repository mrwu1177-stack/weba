// Next.js API Route for Binance Kline Data
// 代理 Binance K线数据，解决 CORS 问题

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const interval = searchParams.get('interval') || '1h';
  const limit = searchParams.get('limit') || '500';

  if (!symbol) {
    return new Response(JSON.stringify({ error: 'Missing symbol parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 从 Binance 公共 API 获取 K线数据
    const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

    const response = await fetch(binanceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.json();

    // 转换为 Lightweight Charts 格式
    const klineData = rawData.map(kline => ({
      time: Math.floor(kline[0] / 1000),
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5])
    }));

    // 返回数据，启用 CORS
    return new Response(JSON.stringify(klineData), {
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
    console.error('Proxy Binance Kline error:', error);
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
