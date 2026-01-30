// API 测试端点
export async function GET() {
  try {
    // 测试 Binance API 连接
    const response = await fetch('https://api.binance.com/api/v3/ping', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (response.ok) {
      return new Response(JSON.stringify({ 
        status: 'success', 
        message: 'Binance API 连接正常',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        status: 'error', 
        message: `Binance API 返回错误: ${response.status}` 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: 'error', 
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
