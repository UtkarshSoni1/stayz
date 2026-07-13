"use client";

import { useState, useCallback, useEffect, useRef, useTransition } from "react";
import { Heart } from "lucide-react";
import { SavedListingCard } from "./saved-listing-card";
import { SavedFiltersBar, type SavedFilters } from "./saved-filters-bar";
import { SavedEmptyState } from "./saved-empty-state";
import { SavedGridSkeleton } from "./saved-skeleton";
import { useToast } from "@/components/ui/toast";
import type { SavedListingDTO } from "@/types/listing";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SavedListingsClientProps {
  initialItems: SavedListingDTO[];
  initialTotal: number;
  initialHasMore: boolean;
}

const PAGE_SIZE = 12;

const DEFAULT_FILTERS: SavedFilters = {
  search: "",
  sort: "NEWEST",
  city: "",
  roomType: "ALL",
};

// ─── Component ─────────────────────────────────────────────────────────────────

export function SavedListingsClient({
  initialItems,
  initialTotal,
  initialHasMore,
}: SavedListingsClientProps) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [items, setItems] = useState<SavedListingDTO[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SavedFilters>(DEFAULT_FILTERS);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [loadingMore, setLoadingMore] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Debounce search/city text inputs
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingFilters = useRef<SavedFilters>(filters);

  // ── Fetch listings ─────────────────────────────────────────────────────────

  const fetchListings = useCallback(
    async (f: SavedFilters, p: number, append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setFetching(true);
      }

      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: String(PAGE_SIZE),
          sort: f.sort,
        });
        if (f.search) params.set("search", f.search);
        if (f.city) params.set("city", f.city);
        if (f.roomType !== "ALL") params.set("roomType", f.roomType);

        const res = await fetch(`/api/saved?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch saved listings.");

        const json = (await res.json()) as {
          success: boolean;
          data: {
            items: SavedListingDTO[];
            total: number;
            hasMore: boolean;
          };
        };

        if (!json.success) throw new Error("API error");

        startTransition(() => {
          setItems((prev) =>
            append ? [...prev, ...json.data.items] : json.data.items
          );
          setTotal(json.data.total);
          setHasMore(json.data.hasMore);
        });
      } catch {
        toast("Failed to load saved listings.", "error");
      } finally {
        setFetching(false);
        setLoadingMore(false);
      }
    },
    [toast]
  );

  // ── Filter change handler ──────────────────────────────────────────────────

  const handleFiltersChange = useCallback(
    (newFilters: SavedFilters) => {
      setFilters(newFilters);
      pendingFilters.current = newFilters;

      // Debounce text inputs; fire immediately for dropdowns
      const isTextChange =
        newFilters.search !== filters.search ||
        newFilters.city !== filters.city;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (isTextChange) {
        debounceRef.current = setTimeout(() => {
          setPage(1);
          fetchListings(pendingFilters.current, 1, false);
        }, 350);
      } else {
        setPage(1);
        fetchListings(newFilters, 1, false);
      }
    },
    [filters.search, filters.city, fetchListings]
  );

  // ── Load more ──────────────────────────────────────────────────────────────

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(filters, nextPage, true);
  }, [filters, hasMore, loadingMore, page, fetchListings]);

  // ── Remove handler ─────────────────────────────────────────────────────────

  const handleRemove = useCallback(
    async (listingId: string) => {
      // Optimistic remove
      setRemovingIds((prev) => new Set([...prev, listingId]));
      const prevItems = items;
      const prevTotal = total;

      startTransition(() => {
        setItems((prev) => prev.filter((item) => item.id !== listingId));
        setTotal((prev) => Math.max(0, prev - 1));
      });

      try {
        const res = await fetch(`/api/saved/${listingId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to remove.");

        toast("Removed from saved listings", "info");
      } catch {
        // Rollback
        startTransition(() => {
          setItems(prevItems);
          setTotal(prevTotal);
        });
        toast("Failed to remove listing.", "error");
      } finally {
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(listingId);
          return next;
        });
      }
    },
    [items, total, toast]
  );

  // ── Clear filters ──────────────────────────────────────────────────────────

  const clearFilters = useCallback(() => {
    handleFiltersChange(DEFAULT_FILTERS);
  }, [handleFiltersChange]);

  // ── Cleanup debounce ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────
  const hasActiveFilters =
    !!filters.search ||
    !!filters.city ||
    filters.roomType !== "ALL" ||
    filters.sort !== "NEWEST";

  const isEmpty = !fetching && items.length === 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-rose-500/10">
          <Heart className="h-5 w-5 text-rose-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Saved Listings</h1>
          <p className="text-xs text-muted-foreground">
            {total === 0
              ? "No saved listings"
              : `${total} saved ${total === 1 ? "listing" : "listings"}`}
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <SavedFiltersBar
        filters={filters}
        onChange={handleFiltersChange}
        totalCount={total}
      />

      {/* Content */}
      {fetching ? (
        <SavedGridSkeleton count={6} />
      ) : isEmpty ? (
        <div className="grid">
          <SavedEmptyState
            filtered={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </div>
      ) : (
        <>
          {/* Grid */}
          <section
            aria-label="Saved listings"
            className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((item) => (
              <SavedListingCard
                key={item.id}
                listing={item}
                onRemove={handleRemove}
                removing={removingIds.has(item.id)}
              />
            ))}
          </section>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                id="saved-load-more"
                onClick={handleLoadMore}
                disabled={loadingMore || isPending}
                aria-label="Load more saved listings"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-white/[0.07] hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                {loadingMore ? (
                  <>
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Loading…
                  </>
                ) : (
                  "Load more"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
