import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/** Neutral shimmer block used while data is loading. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-secondary/80",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** Matching placeholders for the service card grid. */
export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-sm bg-card">
          <Skeleton className="aspect-[4/5] w-full rounded-none" />
          <div className="space-y-4 p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Table placeholder for dashboard list pages. */
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}
