"use client";

import { useState, useMemo, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppNavBar } from "@/components/navbar/AppNavBar";
import { SummaryCards } from "@/components/my-listings/summary-cards";
import { FiltersBar } from "@/components/my-listings/filters-bar";
import { ListingCard } from "@/components/my-listings/listing-card";
import { EmptyState } from "@/components/my-listings/empty-state";
import { ListingsGridSkeleton } from "@/components/my-listings/listing-skeleton";
import type { MyListing } from "@/components/my-listings/types";
import type {
  StatusFilter,
  RoomTypeFilter,
  SortOption,
} from "@/components/my-listings/filters-bar";
import type { MyListingDTO, ApiSuccessResponse, ApiErrorResponse } from "@/types/listing";

// ── DTO → UI type adapter ─────────────────────────────────────────────────────

function toMyListing(dto: MyListingDTO): MyListing {
  return {
    id: dto.id,
    title: dto.title,
    city: dto.city,
    locality: dto.locality,
    rent: dto.rent,
    roomType: dto.roomType as MyListing["roomType"],
    furnishing: dto.furnishing as MyListing["furnishing"],
    genderPreference: dto.genderPreference as MyListing["genderPreference"],
    status: dto.status as MyListing["status"],
    coverImage: dto.coverImage,
    rating: dto.rating,
    reviews: dto.reviews,
    saves: dto.saves,
    createdAt: dto.createdAt,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyListingsPage() {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [roomType, setRoomType] = useState<RoomTypeFilter>("ALL");
  const [sort, setSort] = useState<SortOption>("NEWEST");

  // ── Fetch listings from the API ─────────────────────────────────────────────

  const fetchListings = useCallback(
    async (opts: {
      search: string;
      status: StatusFilter;
      roomType: RoomTypeFilter;
      sort: SortOption;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (opts.search) params.set("search", opts.search);
        if (opts.status !== "ALL") params.set("status", opts.status);
        if (opts.roomType !== "ALL") params.set("roomType", opts.roomType);
        params.set("sort", opts.sort);

        const res = await fetch(`/api/listings/my?${params.toString()}`);
        const json = (await res.json()) as
          | ApiSuccessResponse<MyListingDTO[]>
          | ApiErrorResponse;

        if (!res.ok || !json.success) {
          setError((json as ApiErrorResponse).error ?? "Failed to load listings.");
          return;
        }

        setListings(
          (json as ApiSuccessResponse<MyListingDTO[]>).data.map(toMyListing)
        );
      } catch {
        setError("Network error — please check your connection.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    fetchListings({ search, status, roomType, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch on filter changes (debounced via transition for search)
  useEffect(() => {
    startTransition(() => {
      fetchListings({ search, status, roomType, sort });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, roomType, sort]);

  // ── Computed stats (from full unfiltered listings or API counts) ────────────

  const stats = useMemo(
    () => ({
      total: listings.length,
      active: listings.filter((l) => l.status === "ACTIVE").length,
      draft: listings.filter((l) => l.status === "DRAFT").length,
      rented: listings.filter((l) => l.status === "RENTED").length,
    }),
    [listings]
  );

  // ── Action handlers ─────────────────────────────────────────────────────────

  async function handleDuplicate(id: string) {
    try {
      const res = await fetch(`/api/listings/${id}/duplicate`, {
        method: "POST",
      });
      const json = (await res.json()) as
        | ApiSuccessResponse<MyListingDTO>
        | ApiErrorResponse;

      if (!res.ok || !json.success) return;

      const copy = toMyListing((json as ApiSuccessResponse<MyListingDTO>).data);
      setListings((prev) => [copy, ...prev]);
    } catch {
      // silently fail — user can retry
    }
  }

  async function handleMarkRented(id: string) {
    // Optimistic update
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "RENTED" as const } : l))
    );
    try {
      const res = await fetch(`/api/listings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RENTED" }),
      });
      if (!res.ok) {
        // Revert on failure
        setListings((prev) =>
          prev.map((l) =>
            l.id === id ? { ...l, status: "ACTIVE" as const } : l
          )
        );
      }
    } catch {
      setListings((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: "ACTIVE" as const } : l
        )
      );
    }
  }

  async function handleDelete(id: string) {
    // Optimistic remove
    setListings((prev) => prev.filter((l) => l.id !== id));
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (!res.ok) {
        // Revert — refetch
        fetchListings({ search, status, roomType, sort });
      }
    } catch {
      fetchListings({ search, status, roomType, sort });
    }
  }

  const showSkeleton = isLoading || isPending;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      <AppNavBar />

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Page heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Listings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage, edit, and track all your room listings from one place.
          </p>
        </div>

        {/* Summary cards */}
        <SummaryCards
          total={stats.total}
          active={stats.active}
          draft={stats.draft}
          rented={stats.rented}
        />

        {/* Filters */}
        <div className="rounded-xl border border-white/[0.07] bg-[#111]/60 p-4">
          <FiltersBar
            search={search}
            status={status}
            roomType={roomType}
            sort={sort}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onRoomTypeChange={setRoomType}
            onSortChange={setSort}
          />
        </div>

        {/* Error state */}
        {error && !showSkeleton && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Results count */}
        {!showSkeleton && !error && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground/60">
              {listings.length === 0
                ? "No listings match your filters"
                : `${listings.length} listing${listings.length !== 1 ? "s" : ""} found`}
            </p>
            {(search || status !== "ALL" || roomType !== "ALL") && (
              <button
                className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors underline underline-offset-2"
                onClick={() => {
                  setSearch("");
                  setStatus("ALL");
                  setRoomType("ALL");
                  setSort("NEWEST");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {showSkeleton ? (
          <ListingsGridSkeleton count={6} />
        ) : listings.length === 0 && !error ? (
          <div className="grid grid-cols-1">
            <EmptyState />
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onDuplicate={handleDuplicate}
                onMarkRented={handleMarkRented}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
