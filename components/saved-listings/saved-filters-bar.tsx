"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type SavedSortOption =
  | "NEWEST"
  | "OLDEST"
  | "RENT_LOW_HIGH"
  | "RENT_HIGH_LOW"
  | "RATING";

export type SavedRoomTypeFilter =
  | "ALL"
  | "SINGLE"
  | "SHARED"
  | "PG"
  | "FLAT";

export interface SavedFilters {
  search: string;
  sort: SavedSortOption;
  city: string;
  roomType: SavedRoomTypeFilter;
}

interface SavedFiltersBarProps {
  filters: SavedFilters;
  onChange: (filters: SavedFilters) => void;
  totalCount: number;
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const selectTriggerClass =
  "h-9 min-w-[130px] border-white/[0.08] bg-white/[0.04] text-sm text-foreground hover:bg-white/[0.07] focus:border-white/20 focus:ring-0 rounded-lg transition-colors";

// ─── Component ─────────────────────────────────────────────────────────────────

export function SavedFiltersBar({
  filters,
  onChange,
  totalCount,
}: SavedFiltersBarProps) {
  const hasActiveFilters =
    !!filters.search ||
    !!filters.city ||
    filters.roomType !== "ALL" ||
    filters.sort !== "NEWEST";

  function update(partial: Partial<SavedFilters>) {
    onChange({ ...filters, ...partial });
  }

  function clearAll() {
    onChange({ search: "", sort: "NEWEST", city: "", roomType: "ALL" });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Top row: search + count */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
          <Input
            id="saved-search"
            placeholder="Search by title, city, locality…"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="h-9 pl-9 border-white/[0.08] bg-white/[0.04] text-sm placeholder:text-muted-foreground/50 focus-visible:border-white/20 focus-visible:ring-0 rounded-lg"
            aria-label="Search saved listings"
          />
        </div>

        {/* Result count badge */}
        <span className="hidden sm:inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground">
          {totalCount} saved
        </span>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            aria-label="Clear all filters"
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground hover:bg-white/[0.07] hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />

        {/* Sort */}
        <Select
          value={filters.sort}
          onValueChange={(v) => update({ sort: v as SavedSortOption })}
        >
          <SelectTrigger id="saved-sort" className={selectTriggerClass}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEWEST">Newest Saved</SelectItem>
            <SelectItem value="OLDEST">Oldest Saved</SelectItem>
            <SelectItem value="RENT_LOW_HIGH">Rent: Low → High</SelectItem>
            <SelectItem value="RENT_HIGH_LOW">Rent: High → Low</SelectItem>
            <SelectItem value="RATING">Top Rated</SelectItem>
          </SelectContent>
        </Select>

        {/* City filter */}
        <div className="relative">
          <Input
            id="saved-city-filter"
            placeholder="City…"
            value={filters.city}
            onChange={(e) => update({ city: e.target.value })}
            className="h-9 w-28 border-white/[0.08] bg-white/[0.04] text-sm placeholder:text-muted-foreground/50 focus-visible:border-white/20 focus-visible:ring-0 rounded-lg"
            aria-label="Filter by city"
          />
        </div>

        {/* Room Type filter */}
        <Select
          value={filters.roomType}
          onValueChange={(v) => update({ roomType: v as SavedRoomTypeFilter })}
        >
          <SelectTrigger id="saved-room-type" className={selectTriggerClass}>
            <SelectValue placeholder="Room Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="SINGLE">Single</SelectItem>
            <SelectItem value="SHARED">Shared</SelectItem>
            <SelectItem value="PG">PG</SelectItem>
            <SelectItem value="FLAT">Flat</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
