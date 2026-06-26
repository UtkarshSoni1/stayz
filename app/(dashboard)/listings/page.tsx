import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { RoomType, GenderPreference } from "@prisma/client";
import SearchBar from "@/components/listings/SearchBar";
import DashboardButton from "@/components/listings/DashboardButton";
import ListingCard from "@/components/listings/ListingCard";
import { Home } from "lucide-react";
import {
  ROOM_TYPE_LABELS,
  GENDER_LABELS,
} from "@/components/listings/listingConfig";

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata = {
  title: "Listings | StayZ",
  description: "Browse rooms, PGs, and flats across Indian cities.",
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface SearchParams {
  city?: string;
  roomType?: string;
  genderPreference?: string;
}

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getListings(filters: SearchParams) {
  const where: {
    city?: { contains: string; mode: "insensitive" };
    roomType?: RoomType;
    genderPreference?: GenderPreference;
  } = {};

  if (filters.city?.trim()) {
    where.city = { contains: filters.city.trim(), mode: "insensitive" };
  }
  if (filters.roomType && filters.roomType in ROOM_TYPE_LABELS) {
    where.roomType = filters.roomType as RoomType;
  }
  if (filters.genderPreference && filters.genderPreference in GENDER_LABELS) {
    where.genderPreference = filters.genderPreference as GenderPreference;
  }

  return prisma.listing.findMany({
    where,
    include: {
      images: { take: 1, orderBy: { sortOrder: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-xl border bg-card p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-muted/30">
        <Home className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">No spaces found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or check back later.
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [filters, session] = await Promise.all([searchParams, auth()]);
  const listings = await getListings(filters);
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Top row: wordmark + dashboard button */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Home className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h1 className="text-3xl font-bold leading-none tracking-tight text-primary sm:text-4xl">
                  StayZ
                </h1>
                <p className="mt-0.5 text-sm italic text-muted-foreground">
                  for Gen-Z, by Gen-Z
                </p>
              </div>
            </div>
            <DashboardButton isLoggedIn={isLoggedIn} />
          </div>

          {/* Search bar — Suspense required for useSearchParams */}
          <Suspense fallback={<div className="h-14 rounded-xl bg-muted/30 animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Results count */}
        <p className="mb-6 text-xs text-muted-foreground">
          {listings.length === 0
            ? "No listings match your filters."
            : `${listings.length} space${listings.length !== 1 ? "s" : ""} found`}
        </p>

        {/* Grid */}
        <section
          aria-label="Listing results"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {listings.length === 0 ? (
            <EmptyState />
          ) : (
            listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
