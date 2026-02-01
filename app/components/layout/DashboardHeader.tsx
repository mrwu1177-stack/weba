'use client';

import { useState } from 'react';
import Link from 'next/link';

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <span className="text-slate-950 font-bold text-lg">HY</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                HelloYan
              </h1>
              <p className="text-xs text-slate-400">智能加密货币分析</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              概览
            </Link>
            <Link href="/markets" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              市场
            </Link>
            <Link href="/strategies" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              策略
            </Link>
            <Link href="/liquidations" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              爆仓
            </Link>
            <Link href="/analytics" className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors">
              分析
            </Link>
          </nav>

          {/* Status & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-300">运行中</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            <Link href="/" className="block px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-300">
              概览
            </Link>
            <Link href="/markets" className="block px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-300">
              市场
            </Link>
            <Link href="/strategies" className="block px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-300">
              策略
            </Link>
            <Link href="/liquidations" className="block px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-300">
              爆仓
            </Link>
            <Link href="/analytics" className="block px-3 py-2 rounded-lg hover:bg-slate-800/50 text-sm font-medium text-slate-300">
              分析
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
