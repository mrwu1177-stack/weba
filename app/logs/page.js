'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function LogsPage() {
  const [logs, setLogs] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  // 检查是否已认证
  useEffect(() => {
    const storedAuth = localStorage.getItem('logs_auth')
    if (storedAuth === 'true') {
      setAuthenticated(true)
      fetchLogs()
    }
  }, [])

  // 登录
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/logs', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })

      if (response.ok) {
        setAuthenticated(true)
        localStorage.setItem('logs_auth', 'true')
        fetchLogs()
      } else {
        setError('认证失败，请检查密码')
      }
    } catch (err) {
      setError('登录失败：' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // 获取日志
  const fetchLogs = async () => {
    setLoading(true)
    setError('')

    try {
      const url = `/api/logs?limit=100&type=${filterType}`
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
        setSummary(data.summary || null)
      } else if (response.status === 401) {
        setAuthenticated(false)
        localStorage.removeItem('logs_auth')
        setError('认证失败，请重新登录')
      } else {
        setError('获取日志失败')
      }
    } catch (err) {
      setError('获取日志失败：' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // 清空日志
  const clearLogs = async () => {
    if (!confirm('确定要清空所有日志吗？')) return

    setLoading(true)
    try {
      const response = await fetch('/api/logs', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })

      if (response.ok) {
        fetchLogs()
      } else {
        setError('清空日志失败')
      }
    } catch (err) {
      setError('清空日志失败：' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const handleLogout = () => {
    setAuthenticated(false)
    localStorage.removeItem('logs_auth')
    setPassword('')
    setLogs([])
    setSummary(null)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Head>
          <title>HelloYan - 系统日志</title>
        </Head>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            🔐 HelloYan 系统日志
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                管理员密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="请输入管理员密码"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>HelloYan - 系统日志</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            📊 HelloYan 系统日志
          </h1>

          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              登出
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              清空日志
            </button>
          </div>
        </div>

        {/* 筛选 */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-300">筛选：</span>
            {['all', 'api_call'].map(type => (
              <button
                key={type}
                onClick={() => {
                  setFilterType(type)
                  fetchLogs()
                }}
                className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type === 'all' ? '全部' : 'API 调用'}
              </button>
            ))}
          </div>
        </div>

        {/* 摘要 */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">总日志数</div>
              <div className="text-2xl font-bold text-white">{summary.total}</div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">成功调用</div>
              <div className="text-2xl font-bold text-green-500">
                {summary.byType?.success || 0}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">备用数据</div>
              <div className="text-2xl font-bold text-yellow-500">
                {summary.byType?.fallback || 0}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">失败调用</div>
              <div className="text-2xl font-bold text-red-500">
                {summary.byType?.error || 0}
              </div>
            </div>
          </div>
        )}

        {/* 最近错误 */}
        {summary && summary.recentErrors && summary.recentErrors.length > 0 && (
          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-6">
            <h3 className="text-red-400 font-bold mb-3">⚠️ 最近的错误</h3>
            <div className="space-y-2">
              {summary.recentErrors.map((err, index) => (
                <div key={index} className="bg-gray-900/50 p-3 rounded">
                  <div className="text-sm text-gray-300 mb-1">{err.url}</div>
                  <div className="text-xs text-red-400">{err.error}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(err.time).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* 错误信息 */}
        {error && (
          <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 日志列表 */}
        {!loading && logs.length > 0 && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-300 text-sm">时间</th>
                  <th className="px-4 py-3 text-left text-gray-300 text-sm">类型</th>
                  <th className="px-4 py-3 text-left text-gray-300 text-sm">消息</th>
                  <th className="px-4 py-3 text-left text-gray-300 text-sm">详情</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={log.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      {new Date(log.timestamp).toLocaleString('zh-CN')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          log.metadata?.type === 'success'
                            ? 'bg-green-500/20 text-green-400'
                            : log.metadata?.type === 'fallback'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : log.metadata?.type === 'error'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {log.metadata?.type?.toUpperCase() || log.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      {log.message}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {log.metadata && (
                        <div className="space-y-1">
                          {log.metadata.duration && (
                            <div>耗时: {log.metadata.duration}ms</div>
                          )}
                          {log.metadata.source && (
                            <div>来源: {log.metadata.source}</div>
                          )}
                          {log.metadata.error && (
                            <div className="text-red-400">{log.metadata.error}</div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 空状态 */}
        {!loading && logs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            暂无日志数据
          </div>
        )}
      </div>
    </div>
  )
}
