"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PlusCircle, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/my-listings/summary-cards";
import { FiltersBar } from "@/components/my-listings/filters-bar";
import { ListingCard } from "@/components/my-listings/listing-card";
import { EmptyState } from "@/components/my-listings/empty-state";
import { ListingsGridSkeleton } from "@/components/my-listings/listing-skeleton";
import { DUMMY_LISTINGS } from "@/lib/dummy-listings";
import type { MyListing } from "@/components/my-listings/types";
import type {
  StatusFilter,
  RoomTypeFilter,
  SortOption,
} from "@/components/my-listings/filters-bar";

// ── Helpers ───────────────────────────────────────────────────────────────────

function applyFiltersAndSort(
  listings: MyListing[],
  search: string,
  status: StatusFilter,
  roomType: RoomTypeFilter,
  sort: SortOption
): MyListing[] {
  let result = [...listings];

  // Search
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.locality.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
    );
  }

  // Status
  if (status !== "ALL") {
    result = result.filter((l) => l.status === status);
  }

  // Room type
  if (roomType !== "ALL") {
    result = result.filter((l) => l.roomType === roomType);
  }

  // Sort
  switch (sort) {
    case "NEWEST":
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "OLDEST":
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "RENT_HIGH_LOW":
      result.sort((a, b) => b.rent - a.rent);
      break;
    case "RENT_LOW_HIGH":
      result.sort((a, b) => a.rent - b.rent);
      break;
  }

  return result;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MyListingsPage() {
  const [listings, setListings] = useState<MyListing[]>(DUMMY_LISTINGS);
  const [isLoading] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [roomType, setRoomType] = useState<RoomTypeFilter>("ALL");
  const [sort, setSort] = useState<SortOption>("NEWEST");

  // Computed stats
  const stats = useMemo(
    () => ({
      total: listings.length,
      active: listings.filter((l) => l.status === "ACTIVE").length,
      draft: listings.filter((l) => l.status === "DRAFT").length,
      rented: listings.filter((l) => l.status === "RENTED").length,
    }),
    [listings]
  );

  // Filtered + sorted view
  const filteredListings = useMemo(
    () => applyFiltersAndSort(listings, search, status, roomType, sort),
    [listings, search, status, roomType, sort]
  );

  // Handlers
  function handleDuplicate(id: string) {
    const original = listings.find((l) => l.id === id);
    if (!original) return;
    const duplicate: MyListing = {
      ...original,
      id: `lst-dup-${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: "DRAFT",
      rating: null,
      reviews: 0,
      saves: 0,
      createdAt: new Date().toISOString(),
    };
    setListings((prev) => [duplicate, ...prev]);
  }

  function handleMarkRented(id: string) {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "RENTED" as const } : l))
    );
  }

  function handleDelete(id: string) {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
                <LayoutGrid className="h-4 w-4 text-black" />
              </div>
              <span className="font-bold text-base tracking-tight text-foreground hidden sm:block">
                StayZ
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/listings"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse
              </Link>
              <Link
                href="/my-listings"
                className="text-foreground font-medium border-b border-white/40 pb-0.5"
              >
                My Listings
              </Link>
            </nav>

            {/* Add new */}
            <Button
              asChild
              className="gap-2 rounded-lg bg-white text-black hover:bg-white/90 font-medium shadow-md shrink-0"
            >
              <Link href="/add-listing">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Add New Listing</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

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

        {/* Results count */}
        {!isLoading && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground/60">
              {filteredListings.length === 0
                ? "No listings match your filters"
                : `${filteredListings.length} listing${filteredListings.length !== 1 ? "s" : ""} found`}
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
        {isLoading ? (
          <ListingsGridSkeleton count={6} />
        ) : filteredListings.length === 0 ? (
          <div className="grid grid-cols-1">
            <EmptyState />
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
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
