'use client';

import { useMarkets, useLiquidations, useStrategySignals, useNews } from '@/lib/hooks/useApi';
import { CardSkeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatPercentage, getColorForChange, formatNumber } from '@/lib/utils';
import type { Market, StrategySignal, News } from '@/lib/types';

export default function HomePage() {
  const { data: markets, isLoading: marketsLoading } = useMarkets({ per_page: 20, order: 'market_cap_desc' });
  const { data: liquidations, isLoading: liquidationsLoading } = useLiquidations({ limit: 10 });
  const { data: signals, isLoading: signalsLoading } = useStrategySignals({ limit: 5 });
  const { data: news, isLoading: newsLoading } = useNews({ limit: 5 });

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#E0E0E5]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0F1117]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0F1117]/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-[#FCD535]">HelloYan</h1>
              <nav className="hidden md:flex gap-6">
                <a href="/markets" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Markets
                </a>
                <a href="/strategies" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Strategies
                </a>
                <a href="/liquidations" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Liquidations
                </a>
                <a href="/news" className="text-sm text-gray-400 hover:text-white transition-colors">
                  News
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Live</span>
              </div>
              <a href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <div className="text-sm text-gray-400 mb-1">Total Market Cap</div>
            <div className="text-xl font-semibold">
              {markets?.[0]?.marketCap ? formatCurrency(markets[0].marketCap) : '--'}
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <div className="text-sm text-gray-400 mb-1">24h Volume</div>
            <div className="text-xl font-semibold">
              {markets?.[0]?.volume24h ? formatCurrency(markets[0].volume24h) : '--'}
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <div className="text-sm text-gray-400 mb-1">Active Signals</div>
            <div className="text-xl font-semibold">
              {signals?.length || 0}
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <div className="text-sm text-gray-400 mb-1">Recent Liquidations</div>
            <div className="text-xl font-semibold">
              {liquidations?.length || 0}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Markets Section */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
              <div className="border-b border-gray-800 px-4 py-3">
                <h2 className="text-lg font-semibold">Top Markets</h2>
              </div>
              <div className="divide-y divide-gray-800">
                {marketsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4">
                      <CardSkeleton />
                    </div>
                  ))
                ) : (
                  markets?.slice(0, 10).map((market: Market) => (
                    <div
                      key={market.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-400 w-8">
                          #{market.marketCapRank}
                        </div>
                        <div>
                          <div className="font-medium">{market.name}</div>
                          <div className="text-sm text-gray-400 uppercase">{market.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(market.currentPrice)}</div>
                        <div className={`text-sm ${getColorForChange(market.priceChangePercentage24h)}`}>
                          {formatPercentage(market.priceChangePercentage24h)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Signals Section */}
          <div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
              <div className="border-b border-gray-800 px-4 py-3">
                <h2 className="text-lg font-semibold">Latest Signals</h2>
              </div>
              <div className="divide-y divide-gray-800">
                {signalsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4">
                      <CardSkeleton />
                    </div>
                  ))
                ) : (
                  signals?.slice(0, 5).map((signal: StrategySignal) => (
                    <div key={signal.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium uppercase">{signal.coinSymbol}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          signal.signalType === 'buy' 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {signal.signalType.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">{signal.signalName}</div>
                      <div className="text-sm text-gray-500">{signal.reason}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* News Section */}
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden mt-6">
              <div className="border-b border-gray-800 px-4 py-3">
                <h2 className="text-lg font-semibold">Latest News</h2>
              </div>
              <div className="divide-y divide-gray-800">
                {newsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4">
                      <CardSkeleton />
                    </div>
                  ))
                ) : (
                  news?.slice(0, 5).map((item: News) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="text-sm text-gray-400 mb-1">{item.source}</div>
                      <div className="text-sm">{item.title}</div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          <p>© 2026 HelloYan. All rights reserved.</p>
          <p className="mt-2">Data provided by CoinGecko and other sources.</p>
        </div>
      </footer>
    </div>
  );
}
