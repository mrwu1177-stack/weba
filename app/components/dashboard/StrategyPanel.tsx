'use client';

import { useEffect, useState } from 'react';

interface Signal {
  coin: string;
  signal: 'buy' | 'sell';
  confidence: number;
  reason: string;
  timestamp: string;
}

export function StrategyPanel() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch('/api/proxy/aggregated?endpoint=signals');
        const data = await response.json();
        setSignals(data?.slice(0, 8) || []);
      } catch (error) {
        console.error('Failed to fetch signals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
    const interval = setInterval(fetchSignals, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="h-48 bg-slate-800/50 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {signals.map((signal, idx) => (
        <div
          key={idx}
          className="p-4 rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm hover:border-amber-500/30 transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-white">{signal.coin}</h3>
              <p className="text-xs text-slate-400 mt-1">{signal.timestamp}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              signal.signal === 'buy'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-orange-500/20 text-orange-400'
            }`}>
              {signal.signal === 'buy' ? '买入' : '卖出'}
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-3">{signal.reason}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">置信度</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 rounded-full bg-slate-700/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 transition-all"
                  style={{ width: `${signal.confidence}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-slate-300">{signal.confidence}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
