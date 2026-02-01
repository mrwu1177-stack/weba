'use client';

export interface Column<T> {
  key: keyof T;
  label: string;
  width?: string;
  format?: (value: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  compact?: boolean;
}

export function DataTable<T>({ columns, data, loading, compact }: DataTableProps<T>) {
  if (loading) {
    return <div className="h-32 bg-slate-800/50 rounded-lg animate-pulse"></div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
      <table className={`w-full ${compact ? 'text-xs' : 'text-sm'}`}>
        <thead className="border-b border-slate-700/50 bg-slate-800/50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 font-semibold text-slate-300 text-${col.align || 'left'}`}
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-4 py-3 text-slate-300 text-${col.align || 'left'}`}
                >
                  {col.format ? col.format(row[col.key]) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
