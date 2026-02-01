'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/ui/StatCard';

interface MarketData {
  marketCap: number;
  volume24h: number;
  btcDominance: number;
  fear_greed_index: number;
}

export function MarketStats() {
  const [stats, setStats] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/proxy/aggregated?endpoint=global');
        const data = await response.json();
        
        setStats({
          marketCap: data?.data?.total_market_cap?.usd || 0,
          volume24h: data?.data?.total_volume?.usd || 0,
          btcDominance: data?.data?.btc_market_cap_percentage || 0,
          fear_greed_index: 50,
        });
      } catch (error) {
        console.error('Failed to fetch market stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-800/50 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="总市值"
        value={`${(stats?.marketCap || 0) / 1e12}`}
        unit="T"
        icon="💰"
        trend={2.5}
      />
      <StatCard
        title="24h 成交量"
        value={`${(stats?.volume24h || 0) / 1e12}`}
        unit="T"
        icon="📊"
        trend={-1.2}
      />
      <StatCard
        title="BTC 主导率"
        value={`${stats?.btcDominance || 0}`}
        unit="%"
        icon="₿"
        trend={0.8}
      />
      <StatCard
        title="恐惧贪婪指数"
        value={`${stats?.fear_greed_index || 0}`}
        unit="/100"
        icon="📈"
        trend={5.0}
      />
    </div>
  );
}