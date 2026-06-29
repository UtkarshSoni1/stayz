"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type StatusFilter = "ALL" | "ACTIVE" | "DRAFT" | "RENTED";
export type RoomTypeFilter = "ALL" | "SINGLE" | "SHARED" | "PG" | "FLAT";
export type SortOption =
  | "NEWEST"
  | "OLDEST"
  | "RENT_HIGH_LOW"
  | "RENT_LOW_HIGH";

interface FiltersBarProps {
  search: string;
  status: StatusFilter;
  roomType: RoomTypeFilter;
  sort: SortOption;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
  onRoomTypeChange: (v: RoomTypeFilter) => void;
  onSortChange: (v: SortOption) => void;
}

const selectTriggerClass =
  "h-9 min-w-[130px] border-white/[0.08] bg-white/[0.04] text-sm text-foreground hover:bg-white/[0.07] focus:border-white/20 focus:ring-0 rounded-lg transition-colors";

export function FiltersBar({
  search,
  status,
  roomType,
  sort,
  onSearchChange,
  onStatusChange,
  onRoomTypeChange,
  onSortChange,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-0 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
        <Input
          id="my-listings-search"
          placeholder="Search by title or locality…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9 border-white/[0.08] bg-white/[0.04] text-sm placeholder:text-muted-foreground/50 focus-visible:border-white/20 focus-visible:ring-0 rounded-lg"
        />
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />

        {/* Status filter */}
        <Select value={status} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
          <SelectTrigger id="filter-status" className={selectTriggerClass}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="RENTED">Rented</SelectItem>
          </SelectContent>
        </Select>

        {/* Room type filter */}
        <Select value={roomType} onValueChange={(v) => onRoomTypeChange(v as RoomTypeFilter)}>
          <SelectTrigger id="filter-room-type" className={selectTriggerClass}>
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

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger id="filter-sort" className={selectTriggerClass}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEWEST">Newest First</SelectItem>
            <SelectItem value="OLDEST">Oldest First</SelectItem>
            <SelectItem value="RENT_HIGH_LOW">Rent: High → Low</SelectItem>
            <SelectItem value="RENT_LOW_HIGH">Rent: Low → High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
