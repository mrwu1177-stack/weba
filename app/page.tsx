'use client';

import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { MarketStats } from '@/components/dashboard/MarketStats';
import { LiquidationMonitor } from '@/components/dashboard/LiquidationMonitor';
import { StrategyPanel } from '@/components/dashboard/StrategyPanel';
import { MarketAnomalies } from '@/components/dashboard/MarketAnomalies';
import { NewsTracker } from '@/components/dashboard/NewsTracker';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <DashboardHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Market Stats */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">市场概览</h2>
            <MarketStats />
          </section>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: News & Anomalies */}
            <div className="lg:col-span-1 space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-white mb-4">新闻追踪</h2>
                <NewsTracker />
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-4">市场异动</h2>
                <MarketAnomalies />
              </section>
            </div>

            {/* Center Column: Charts */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-white mb-4">爆仓清算监控</h2>
                <LiquidationMonitor />
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-4">策略分析</h2>
                <StrategyPanel />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}