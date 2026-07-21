"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationBarProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function PaginationBar({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: PaginationBarProps) {
  const start = Math.min((page - 1) * pageSize + 1, total)
  const end = Math.min(page * pageSize, total)

  if (totalPages <= 1 && total === 0) return null

  return (
    <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
      <p className="text-xs text-white/40">
        {total === 0
          ? "No results"
          : `Showing ${start}–${end} of ${total} results`}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 7) {
              pageNum = i + 1
            } else if (page <= 4) {
              if (i < 5) pageNum = i + 1
              else if (i === 5) pageNum = -1 // ellipsis
              else pageNum = totalPages
            } else if (page >= totalPages - 3) {
              if (i === 0) pageNum = 1
              else if (i === 1) pageNum = -1
              else pageNum = totalPages - (6 - i)
            } else {
              if (i === 0) pageNum = 1
              else if (i === 1) pageNum = -1
              else if (i === 5) pageNum = -2
              else if (i === 6) pageNum = totalPages
              else pageNum = page + (i - 3)
            }

            if (pageNum < 0) {
              return (
                <span key={`ellipsis-${i}`} className="text-white/30 px-1 text-xs">
                  …
                </span>
              )
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`h-7 w-7 rounded-md text-xs font-medium transition-colors ${
                  pageNum === page
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white disabled:opacity-30"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  )
}
