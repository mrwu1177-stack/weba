'use client';

import { useState, useEffect } from 'react';
import { useApiStatus } from '@/lib/hooks/useApi';
import { api } from '@/lib/api';
import { CardSkeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/utils';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('api-status');

  const { data: apiStatus, isLoading: apiStatusLoading } = useApiStatus();

  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password === 'helloyan2026') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      setError('密码错误');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1117]">
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#FCD535] mb-2">HelloYan</h1>
            <p className="text-gray-400">管理后台</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                管理员密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#FCD535] transition-colors"
                placeholder="请输入密码"
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FCD535] text-black font-semibold rounded-lg hover:bg-[#FCD535]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0F1117]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0F1117]/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-[#FCD535]">HelloYan Admin</h1>
              <span className="text-sm text-gray-400">管理后台</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-[#0F1117]/50">
        <div className="container mx-auto px-4">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('api-status')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'api-status'
                  ? 'text-[#FCD535] border-b-2 border-[#FCD535]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              API状态
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'config'
                  ? 'text-[#FCD535] border-b-2 border-[#FCD535]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              配置管理
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'api-status' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">API运行状态监控</h2>
            
            {apiStatusLoading ? (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
                <div className="divide-y divide-gray-800">
                  {apiStatus?.map((api) => (
                    <div
                      key={api.apiName}
                      className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          api.status === 'healthy' ? 'bg-green-500' :
                          api.status === 'degraded' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                        <div>
                          <div className="font-medium">{api.apiName}</div>
                          <div className="text-sm text-gray-400">
                            延迟: {api.latency}ms
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          api.status === 'healthy' ? 'text-green-500' :
                          api.status === 'degraded' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {api.status === 'healthy' ? '正常' :
                           api.status === 'degraded' ? '降级' : '故障'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(api.lastChecked).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">配置管理</h2>
            
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    API Base URL
                  </label>
                  <input
                    type="text"
                    defaultValue={process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#FCD535] transition-colors"
                    placeholder="API Base URL"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    后端API的基础URL，用于统一数据接口
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    CoinGecko API Key
                  </label>
                  <input
                    type="password"
                    placeholder="输入API密钥"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#FCD535] transition-colors"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    用于访问CoinGecko Pro API，获取实时市场数据
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    自动刷新间隔（秒）
                  </label>
                  <input
                    type="number"
                    defaultValue={30}
                    min={10}
                    max={300}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#FCD535] transition-colors"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    页面数据自动刷新的时间间隔
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    className="px-6 py-3 bg-[#FCD535] text-black font-semibold rounded-lg hover:bg-[#FCD535]/90 transition-colors"
                  >
                    保存配置
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
