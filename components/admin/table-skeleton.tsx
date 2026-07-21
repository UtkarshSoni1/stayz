import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  /** Number of skeleton rows to render */
  rows?: number
  /** Number of columns */
  cols?: number
}

export function TableSkeleton({ rows = 8, cols = 6 }: TableSkeletonProps) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111] overflow-hidden">
      {/* Header row */}
      <div className="border-b border-white/[0.06] px-4 py-3 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 bg-white/[0.06] rounded-md" />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="border-b border-white/[0.04] last:border-0 px-4 py-4 grid gap-4 items-center"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className="h-4 bg-white/[0.04] rounded-md"
              style={{
                width:
                  colIdx === 0
                    ? "80%"
                    : colIdx === cols - 1
                    ? "60%"
                    : `${60 + Math.random() * 30}%`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
