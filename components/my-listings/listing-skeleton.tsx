"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ListingCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111]/80">
      {/* Image skeleton */}
      <Skeleton className="h-44 w-full rounded-none" />

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />

        {/* Badges */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <Skeleton className="h-3 w-10 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-3 w-12 rounded-md" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
        <Skeleton className="h-3 w-20 rounded-md" />
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ListingsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
