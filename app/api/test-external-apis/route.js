// API 测试端点 - 测试外部 API 连接
export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    apis: {}
  };

  // 测试 Binance API
  try {
    const start = Date.now();
    const response = await fetch('https://api.binance.com/api/v3/ping', {
      signal: AbortSignal.timeout(5000)
    });
    const duration = Date.now() - start;
    results.apis.binance = {
      status: response.status,
      success: response.ok,
      duration: duration + 'ms'
    };
  } catch (error) {
    results.apis.binance = {
      status: 'error',
      success: false,
      error: error.message
    };
  }

  // 测试 CoinGecko API
  try {
    const start = Date.now();
    const response = await fetch('https://api.coingecko.com/api/v3/ping', {
      signal: AbortSignal.timeout(5000)
    });
    const duration = Date.now() - start;
    results.apis.coingecko = {
      status: response.status,
      success: response.ok,
      duration: duration + 'ms'
    };
  } catch (error) {
    results.apis.coingecko = {
      status: 'error',
      success: false,
      error: error.message
    };
  }

  // 测试本机 Next.js API
  try {
    const start = Date.now();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/test-connection`, {
      signal: AbortSignal.timeout(5000)
    });
    const duration = Date.now() - start;
    results.apis.nextjs = {
      status: response.status,
      success: response.ok,
      duration: duration + 'ms'
    };
  } catch (error) {
    results.apis.nextjs = {
      status: 'error',
      success: false,
      error: error.message
    };
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
