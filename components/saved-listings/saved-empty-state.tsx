"use client";

import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedEmptyStateProps {
  /** Whether filters are active — shows different copy */
  filtered?: boolean;
  onClearFilters?: () => void;
}

export function SavedEmptyState({
  filtered = false,
  onClearFilters,
}: SavedEmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-6 rounded-2xl border border-white/[0.07] bg-[#111]/60 px-8 py-20 text-center">
      {/* Illustration */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-rose-500/10 blur-xl" aria-hidden />
        {/* Inner circle */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#1a1a1a]">
          <Heart
            className="h-8 w-8 text-rose-400/50"
            strokeWidth={1.5}
          />
        </div>
        {/* Decorative dot */}
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full border border-white/10 bg-rose-500/20 flex items-center justify-center">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" aria-hidden />
        </span>
      </div>

      {/* Copy */}
      <div className="max-w-xs space-y-2">
        {filtered ? (
          <>
            <h3 className="text-base font-semibold text-foreground">
              No results found
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No saved listings match your current filters. Try adjusting or clearing them.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-base font-semibold text-foreground">
              No saved listings yet
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Start browsing and tap the ❤️ on any listing to save it here.
            </p>
          </>
        )}
      </div>

      {/* CTA */}
      {filtered ? (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="mt-2 gap-2 rounded-lg border-white/10 bg-white/[0.04] hover:bg-white/[0.07] font-medium"
        >
          Clear Filters
        </Button>
      ) : (
        <Button
          asChild
          className="mt-2 gap-2 rounded-lg bg-white text-black hover:bg-white/90 font-medium shadow-lg"
        >
          <Link href="/listings">
            <Search className="h-4 w-4" />
            Browse Listings
          </Link>
        </Button>
      )}
    </div>
  );
}
