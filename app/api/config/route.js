import { NextResponse } from 'next/server';

// 简单密码（应该放在环境变量中）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'helloyan2026';

// 配置存储（实际应该使用数据库）
let config = {
  newsApiKey: process.env.NEWS_API_KEY || '',
  newsApiKeySet: false
};

// GET - 获取配置
export async function GET(request) {
  try {
    // 简单的认证检查
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    if (token !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      config: {
        newsApiKey: config.newsApiKeySet ? '••••••••••••••••' : '',
        newsApiKeySet: config.newsApiKeySet
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// POST - 更新配置
export async function POST(request) {
  try {
    // 简单的认证检查
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    if (token !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
    }

    const body = await request.json();
    const { newsApiKey } = body;

    if (newsApiKey) {
      config.newsApiKey = newsApiKey;
      config.newsApiKeySet = true;
    }

    return NextResponse.json({
      success: true,
      message: '配置已更新'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
