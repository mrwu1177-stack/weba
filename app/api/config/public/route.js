import { NextResponse } from 'next/server';

// 导入配置
let config = {
  newsApiKey: ''
};

// 初始化时从环境变量加载
function loadConfig() {
  if (!config.newsApiKey) {
    config.newsApiKey = process.env.NEWS_API_KEY || '';
  }
}

loadConfig();

// GET - 获取 API KEY（无需认证，供前端使用）
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      newsApiKey: config.newsApiKey
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
