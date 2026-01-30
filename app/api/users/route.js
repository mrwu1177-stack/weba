import { NextResponse } from 'next/server';

// 管理员密码（应该放在环境变量中）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'helloyan2026';

// 用户存储（实际应该使用数据库）
let users = [
  {
    id: 'admin',
    username: 'admin',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
];

// 验证管理员认证
function verifyAdminAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === ADMIN_PASSWORD;
}

// GET - 获取用户列表
export async function GET(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let filteredUsers = users;

    // 按角色过滤
    if (role && role !== 'all') {
      filteredUsers = users.filter(user => user.role === role);
    }

    return NextResponse.json({
      success: true,
      users: filteredUsers.map(user => ({
        ...user,
        // 不返回密码字段
        password: undefined
      })),
      total: filteredUsers.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// POST - 创建用户
export async function POST(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: username, password' },
        { status: 400 }
      );
    }

    // 检查用户名是否已存在
    if (users.find(user => user.username === username)) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    const user = {
      id: Date.now().toString(),
      username,
      password, // 实际应该加密存储
      role: role || 'user',
      createdAt: new Date().toISOString()
    };

    users.push(user);

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        password: undefined // 不返回密码
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - 更新用户
export async function PUT(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, username, password, role } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // 不允许修改 admin 用户
    if (id === 'admin') {
      return NextResponse.json(
        { error: 'Cannot modify admin user' },
        { status: 403 }
      );
    }

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // 检查用户名是否与其他用户冲突
    if (username && username !== users[userIndex].username) {
      if (users.find(user => user.username === username)) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }
    }

    // 更新用户信息
    if (username) users[userIndex].username = username;
    if (password) users[userIndex].password = password;
    if (role) users[userIndex].role = role;

    return NextResponse.json({
      success: true,
      user: {
        ...users[userIndex],
        password: undefined // 不返回密码
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - 删除用户
export async function DELETE(request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    // 不允许删除 admin 用户
    if (id === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete admin user' },
        { status: 403 }
      );
    }

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    users.splice(userIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
