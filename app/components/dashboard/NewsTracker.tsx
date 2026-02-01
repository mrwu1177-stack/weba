'use client';

import { useEffect, useState } from 'react';

interface NewsItem {
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export function NewsTracker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/proxy/aggregated?endpoint=news');
        const data = await response.json();
        setNews(data?.slice(0, 6) || []);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="h-64 bg-slate-800/50 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {news.map((item, idx) => (
        <div
          key={idx}
          className="p-3 rounded-lg border border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm hover:border-amber-500/30 transition-all group cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">{item.summary}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{item.source}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  item.sentiment === 'positive'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : item.sentiment === 'negative'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-slate-700/50 text-slate-400'
                }`}>
                  {item.sentiment === 'positive' ? '✓ 利好' : item.sentiment === 'negative' ? '✗ 利空' : '△ 中性'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}