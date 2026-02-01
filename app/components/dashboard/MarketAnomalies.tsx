'use client';

import { useEffect, useState } from 'react';

interface Anomaly {
  type: string;
  coin: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  timestamp: string;
}

export function MarketAnomalies() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const response = await fetch('/api/proxy/aggregated?endpoint=anomalies');
        const data = await response.json();
        setAnomalies(data?.slice(0, 5) || []);
      } catch (error) {
        console.error('Failed to fetch anomalies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalies();
    const interval = setInterval(fetchAnomalies, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="h-40 bg-slate-800/50 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="space-y-3">
      {anomalies.map((anomaly, idx) => (
        <div
          key={idx}
          className="p-3 rounded-lg border border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm hover:border-amber-500/30 transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white text-sm">{anomaly.coin}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  anomaly.severity === 'high'
                    ? 'bg-orange-500/20 text-orange-400'
                    : anomaly.severity === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {anomaly.severity === 'high' ? '高' : anomaly.severity === 'medium' ? '中' : '低'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-1">{anomaly.type}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{anomaly.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}