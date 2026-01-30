import { cn } from '@/app/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-700/50', className)}
      role="status"
      aria-label="Loading"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="mb-2 h-8 w-32" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4 border-b border-gray-800 pb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function NewsItemSkeleton() {
  return (
    <div className="flex gap-4 border-b border-gray-800 pb-4">
      <Skeleton className="h-20 w-20 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
