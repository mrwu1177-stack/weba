'use client';

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon?: string;
  trend?: number;
  loading?: boolean;
}

export function StatCard({ title, value, unit, icon, trend, loading }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 p-4 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300">
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-400">{title}</h3>
          {icon && <span className="text-lg">{icon}</span>}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-slate-400">{unit}</span>}
        </div>

        {/* Trend */}
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            <span className={`inline-flex items-center gap-0.5 px-2 py-1 rounded text-xs font-medium ${
              trend >= 0
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-orange-500/20 text-orange-400'
            }`}>
              {trend >= 0 ? '↑' : '↓'}
              {Math.abs(trend).toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}