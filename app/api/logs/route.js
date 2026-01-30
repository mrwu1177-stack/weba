import { NextResponse } from 'next/server';

// 简单密码（应该放在环境变量中）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'helloyan2026';

// 日志存储（实际应该使用数据库）
let logs = [];
const MAX_LOGS = 1000;

// 验证认证
function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === ADMIN_PASSWORD;
}

// GET - 获取日志
export async function GET(request) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;
    const type = searchParams.get('type');
    const apiType = searchParams.get('apiType');

    let filteredLogs = logs;

    // 按类型过滤
    if (type && type !== 'all') {
      filteredLogs = logs.filter(log => log.type === type);
    }

    // 按 API 类型过滤
    if (apiType && apiType !== 'all') {
      filteredLogs = filteredLogs.filter(log =>
        log.metadata && log.metadata.apiType === apiType
      );
    }

    // 返回最近的日志
    const recentLogs = filteredLogs.slice(0, limit);

    return NextResponse.json({
      success: true,
      logs: recentLogs,
      total: filteredLogs.length,
      summary: generateSummary(filteredLogs)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// POST - 添加日志
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, message, timestamp, metadata } = body;

    if (!type || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: type, message' },
        { status: 400 }
      );
    }

    const log = {
      id: Date.now() + Math.random(),
      type,
      message,
      timestamp: timestamp || new Date().toISOString(),
      source: request.headers.get('user-agent') || 'unknown',
      metadata: metadata || {}
    };

    logs.unshift(log);

    // 限制日志数量
    if (logs.length > MAX_LOGS) {
      logs = logs.slice(0, MAX_LOGS);
    }

    return NextResponse.json({
      success: true,
      log
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - 清空日志
export async function DELETE(request) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const before = searchParams.get('before');

    if (before) {
      // 删除指定时间之前的日志
      const beforeDate = new Date(before);
      logs = logs.filter(log => new Date(log.timestamp) > beforeDate);
    } else {
      // 清空所有日志
      logs = [];
    }

    return NextResponse.json({
      success: true,
      message: before ? '旧日志已清理' : '所有日志已清空'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// 生成日志摘要
function generateSummary(filteredLogs) {
  const summary = {
    total: filteredLogs.length,
    byType: {},
    byApiType: {},
    recentErrors: []
  };

  filteredLogs.forEach(log => {
    // 按类型统计
    if (log.metadata && log.metadata.type) {
      summary.byType[log.metadata.type] = (summary.byType[log.metadata.type] || 0) + 1;
    } else {
      summary.byType[log.type] = (summary.byType[log.type] || 0) + 1;
    }

    // 收集最近的错误
    if (log.metadata && log.metadata.type === 'error' && summary.recentErrors.length < 5) {
      summary.recentErrors.push({
        url: log.metadata.url,
        error: log.metadata.error,
        time: log.timestamp
      });
    }
  });

  return summary;
}
