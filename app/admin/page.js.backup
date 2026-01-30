'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeySet, setApiKeySet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // 日志相关状态
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('all');
  const [logsLoading, setLogsLoading] = useState(false);

  // 用户相关状态
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'user' });
  const [editingUserId, setEditingUserId] = useState(null);

  // 初始化
  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchConfig();
    }
  }, []);

  // 自动刷新日志
  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, logFilter]);

  const fetchConfig = async () => {
    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch('/api/config', {
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeySet(data.config.newsApiKeySet);
      }
    } catch (error) {
      console.error('获取配置失败:', error);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch(`/api/logs?limit=100&type=${logFilter}`, {
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('获取日志失败:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/config', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_password', password);
        await fetchConfig();
        await fetchUsers();
      } else if (response.status === 401) {
        setError('请输入密码');
      } else if (response.status === 403) {
        setError('密码错误');
      } else {
        setError('登录失败，请稍后重试');
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify({
          newsApiKey: apiKey
        })
      });

      if (response.ok) {
        setMessageType('success');
        setMessage('API Key 已保存！');
        setApiKeySet(true);
        setApiKey('');
      } else {
        setMessageType('error');
        setMessage('保存失败，请稍后重试');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('确定要清空所有日志吗？')) {
      return;
    }

    setLogsLoading(true);
    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch('/api/logs', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      });

      if (response.ok) {
        setLogs([]);
        alert('日志已清空');
      }
    } catch (error) {
      console.error('清空日志失败:', error);
      alert('清空日志失败');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleAddUser = () => {
    setUserForm({ username: '', password: '', role: 'user' });
    setEditingUserId(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setUserForm({
      username: user.username,
      password: '',
      role: user.role
    });
    setEditingUserId(user.id);
    setShowUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('确定要删除该用户吗？')) {
      return;
    }

    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      });

      if (response.ok) {
        await fetchUsers();
        alert('用户已删除');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      alert('删除用户失败');
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();

    if (!userForm.username || !userForm.password) {
      alert('请填写用户名和密码');
      return;
    }

    setLoading(true);
    try {
      const auth = localStorage.getItem('admin_password');
      const url = editingUserId
        ? '/api/users'
        : '/api/users';

      const response = await fetch(url, {
        method: editingUserId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify({
          ...(editingUserId && { id: editingUserId }),
          ...userForm
        })
      });

      if (response.ok) {
        await fetchUsers();
        setShowUserModal(false);
        setUserForm({ username: '', password: '', role: 'user' });
        setEditingUserId(null);
        alert('用户已保存');
      } else {
        const data = await response.json();
        alert(data.error || '操作失败');
      }
    } catch (error) {
      console.error('保存用户失败:', error);
      alert('保存用户失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_password');
    setPassword('');
    setApiKey('');
    setApiKeySet(false);
    setMessage('');
    setLogs([]);
    setUsers([]);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLogIcon = (type) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || '📝';
  };

  const getLogColor = (type) => {
    const colors = {
      info: 'text-blue-400',
      success: 'text-green-400',
      warning: 'text-yellow-400',
      error: 'text-red-400'
    };
    return colors[type] || 'text-slate-400';
  };

  const getUserRoleBadge = (role) => {
    const badges = {
      admin: { color: 'bg-purple-500/20 text-purple-400', label: '管理员' },
      user: { color: 'bg-blue-500/20 text-blue-400', label: '用户' }
    };
    return badges[role] || badges.user;
  };

  // 登录页面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                HelloYan
              </span>
            </h1>
            <p className="text-slate-400">后台管理系统</p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  管理密码
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入管理密码"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center">
                默认密码：helloyan2026
              </p>
              <p className="text-xs text-slate-600 text-center mt-1">
                请在 Railway 环境变量中设置 ADMIN_PASSWORD 更改密码
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 配置页面
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                HelloYan
              </span>
            </h1>
            <p className="text-slate-400">后台管理系统</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all text-sm"
          >
            退出登录
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：配置和系统信息 */}
          <div className="space-y-6">
            {/* API Key 配置 */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">API Key 配置</h2>
                {apiKeySet && (
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                    已配置
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Followin News API Key
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={apiKeySet ? '留空保持当前配置' : '请输入 Followin News API Key'}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                {message && (
                  <div className={`p-3 rounded-lg ${
                    messageType === 'success'
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                    <p className={`text-sm ${
                      messageType === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {message}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '保存中...' : '保存配置'}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-800">
                <a href="https://followin.io" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline">
                  获取 API Key →
                </a>
              </div>
            </div>

            {/* 系统信息 */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">系统信息</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">运行状态</span>
                  <span className="text-green-400 text-sm font-medium">正常</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">用户总数</span>
                  <span className="text-slate-300 text-sm font-medium">{users.length}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">日志总数</span>
                  <span className="text-slate-300 text-sm font-medium">{logs.length}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">API Key 状态</span>
                  <span className={apiKeySet ? 'text-green-400' : 'text-yellow-400' + ' text-sm font-medium'}>
                    {apiKeySet ? '已配置' : '未配置'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400 text-sm">自动刷新</span>
                  <span className="text-blue-400 text-sm font-medium">5 秒</span>
                </div>
              </div>
            </div>
          </div>

          {/* 中间：日志监控 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 用户管理 */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">用户管理</h2>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all text-sm"
                >
                  添加用户
                </button>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 h-64 overflow-y-auto">
                {usersLoading && users.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    加载中...
                  </div>
                ) : users.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    暂无用户
                  </div>
                ) : (
                  <div className="space-y-2">
                    {users.map((user) => {
                      const badge = getUserRoleBadge(user.role);
                      return (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 bg-slate-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.username}</p>
                              <p className="text-xs text-slate-400">
                                创建于 {formatTime(user.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                              {badge.label}
                            </span>
                            {user.id !== 'admin' && (
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                              >
                                编辑
                              </button>
                            )}
                            {user.id !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                              >
                                删除
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 日志监控 */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">监控日志</h2>

                <div className="flex items-center gap-3">
                  {/* 过滤器 */}
                  <div className="flex gap-2">
                    {['all', 'info', 'success', 'warning', 'error'].map(type => (
                      <button
                        key={type}
                        onClick={() => setLogFilter(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          logFilter === type
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {type === 'all' ? '全部' : type}
                      </button>
                    ))}
                  </div>

                  {/* 清空按钮 */}
                  <button
                    onClick={handleClearLogs}
                    disabled={logsLoading}
                    className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                  >
                    清空
                  </button>
                </div>
              </div>

              {/* 日志列表 */}
              <div className="bg-slate-800/50 rounded-xl p-4 h-96 overflow-y-auto">
                {logsLoading && logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    加载中...
                  </div>
                ) : logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    暂无日志
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg text-sm"
                      >
                        <span className="text-lg">{getLogIcon(log.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${getLogColor(log.type)}`}>
                            {log.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatTime(log.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>显示最近 {logs.length} 条日志</span>
                <span>自动刷新: 每 5 秒</span>
              </div>
            </div>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            ⚠️ 所有数据保存在服务器内存中，重启后需要重新配置。
            建议在 Railway 环境变量中设置 NEWS_API_KEY 永久保存。
          </p>
        </div>
      </div>

      {/* 用户模态框 */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingUserId ? '编辑用户' : '添加用户'}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  placeholder="请输入用户名"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  密码 {editingUserId && '(留空保持不变)'}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder={editingUserId ? '留空保持不变' : '请输入密码'}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required={!editingUserId}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  角色
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="user">用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '保存中...' : '保存'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
