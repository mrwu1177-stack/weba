// Next.js Edge API Route for CoinGecko API
// 使用 Edge Runtime 解决网络限制问题

export const runtime = 'edge';

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
      },
      // 添加更长的超时时间
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      // 如果 API 返回错误，返回空数据而不是报错
      console.log(`CoinGecko API returned ${response.status}, returning empty data`);

      // 返回空数组，让前端显示占位数据
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Cache-Control': 'public, max-age=60'
        }
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=60'
      }
    });

  } catch (error) {
    console.log('CoinGecko API error:', error.message);

    // 网络错误时返回空数据，让前端显示占位数据
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
