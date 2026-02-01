'use client';

import { useEffect, useState } from 'react';

interface LiquidationData {
  coin: string;
  amount: string;
  price: string;
  type: 'long' | 'short';
  time: string;
}

export function LiquidationMonitor() {
  const [liquidations, setLiquidations] = useState<LiquidationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/proxy/aggregated?endpoint=liquidations');
        const data = await response.json();
        
        setLiquidations(data?.slice(0, 10) || []);
      } catch (error) {
        console.error('Failed to fetch liquidations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="h-64 bg-slate-800/50 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-700/50 bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">交易对</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">方向</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-300">金额</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-300">价格</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-300">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {liquidations.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-4 py-3 font-medium text-white">{item.coin}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                    item.type === 'long'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {item.type === 'long' ? '多头' : '空头'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-white">{item.amount}</td>
                <td className="px-4 py-3 text-right text-slate-400">{item.price}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}