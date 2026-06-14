export function Skeleton({ className = '', rounded = 'rounded-lg' }) {
  return (
    <div className={`skeleton ${rounded} ${className}`} style={{ minHeight: '1rem' }} />
  )
}

export function TaskCardSkeleton() {
  return (
    <div className="card space-y-3 animate-pulse">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="card animate-pulse space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-28" />
    </div>
  )
}
