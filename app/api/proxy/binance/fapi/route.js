// Next.js API Route for Binance Futures API
// 代理 Binance 合约数据，解决 CORS 问题

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const endpoint = searchParams.get('endpoint') || 'ticker/24hr';

  try {
    let binanceUrl;
    if (symbol) {
      binanceUrl = `https://fapi.binance.com/fapi/v1/${endpoint}?symbol=${symbol}`;
    } else {
      binanceUrl = `https://fapi.binance.com/fapi/v1/${endpoint}`;
    }

    console.log('Binance Futures Proxy:', { symbol, endpoint, url: binanceUrl });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

    const response = await fetch(binanceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('Binance Futures Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Binance Futures API error response:', errorText);
      throw new Error(`Binance Futures API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Binance Futures data received');

    // 返回数据，启用 CORS
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=5'
      }
    });

  } catch (error) {
    console.error('Proxy Binance Futures error:', error);
    let errorMessage = error.message;
    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout: Binance API did not respond within 10 seconds';
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
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
