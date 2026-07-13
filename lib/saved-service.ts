import { prisma } from "@/lib/prisma"
import type { Prisma, RoomType } from "@prisma/client"
import type { SavedListingDTO } from "@/types/listing"

// ─── Constants ────────────────────────────────────────────────────────────────

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80"

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface SavedListingsFilters {
  search?: string
  sort?: "NEWEST" | "OLDEST" | "RENT_LOW_HIGH" | "RENT_HIGH_LOW" | "RATING"
  city?: string
  roomType?: "ALL" | RoomType
  page?: number
  limit?: number
}

// ─── Raw shape returned by include (some fields not yet in stale Prisma client) ──

type RawSavedWithListing = {
  userId: string
  listingId: string
  createdAt: Date
  listing: {
    id: string
    title: string
    city: string
    locality: string
    monthlyRent: number
    roomType: RoomType
    furnishing: string
    genderPreference: string
    isAvailable: boolean
    status: string
    // These fields exist in the schema but may be absent in stale Prisma client types
    avgRating?: number | null
    reviewCount?: number
    images: { url: string }[]
  }
}

// ─── getSavedListings ─────────────────────────────────────────────────────────

export async function getSavedListings(
  userId: string,
  filters: SavedListingsFilters = {}
): Promise<{ items: SavedListingDTO[]; total: number; hasMore: boolean }> {
  const {
    search,
    sort = "NEWEST",
    city,
    roomType,
    page = 1,
    limit = 12,
  } = filters

  const skip = (page - 1) * limit

  // Build listing-level where clause
  const listingWhere: Prisma.ListingWhereInput = {}

  if (search?.trim()) {
    listingWhere.OR = [
      { title: { contains: search.trim(), mode: "insensitive" } },
      { locality: { contains: search.trim(), mode: "insensitive" } },
      { city: { contains: search.trim(), mode: "insensitive" } },
    ]
  }
  if (city?.trim()) {
    listingWhere.city = { contains: city.trim(), mode: "insensitive" }
  }
  if (roomType && roomType !== "ALL") {
    listingWhere.roomType = roomType
  }

  const hasListingFilter = Object.keys(listingWhere).length > 0

  // Determine database-level orderBy (RATING sort handled in JS after fetch)
  const needsRatingSort = sort === "RATING"

  const dbOrderBy: Prisma.SavedListingOrderByWithRelationInput =
    sort === "OLDEST"
      ? { createdAt: "asc" }
      : sort === "RENT_LOW_HIGH"
      ? { listing: { monthlyRent: "asc" } }
      : sort === "RENT_HIGH_LOW"
      ? { listing: { monthlyRent: "desc" } }
      : { createdAt: "desc" } // NEWEST + RATING (RATING sorted in JS)

  const where: Prisma.SavedListingWhereInput = {
    userId,
    ...(hasListingFilter ? { listing: listingWhere } : {}),
  }

  // For RATING we fetch all matching rows then sort in JS (feasible for user saves).
  // For all other sorts we paginate at the DB level.
  const [allSaved, total] = await Promise.all([
    (prisma.savedListing.findMany({
      where,
      orderBy: dbOrderBy,
      skip: needsRatingSort ? 0 : skip,
      take: needsRatingSort ? undefined : limit,
      include: {
        listing: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" as const },
              take: 1,
              select: { url: true },
            },
          },
        },
      },
    }) as Promise<RawSavedWithListing[]>),
    prisma.savedListing.count({ where }),
  ])

  // Apply in-JS sort + pagination for RATING
  const saved = needsRatingSort
    ? allSaved
        .sort((a, b) => ((b.listing.avgRating ?? 0) - (a.listing.avgRating ?? 0)))
        .slice(skip, skip + limit)
    : allSaved

  const items: SavedListingDTO[] = saved.map((s) => ({
    id: s.listing.id,
    title: s.listing.title,
    city: s.listing.city,
    locality: s.listing.locality,
    rent: s.listing.monthlyRent,
    roomType: s.listing.roomType,
    furnishing: s.listing.furnishing as SavedListingDTO["furnishing"],
    genderPreference: s.listing.genderPreference as SavedListingDTO["genderPreference"],
    isAvailable: s.listing.isAvailable,
    status: s.listing.status as SavedListingDTO["status"],
    coverImage: s.listing.images[0]?.url ?? PLACEHOLDER_IMAGE,
    rating:
      typeof s.listing.avgRating === "number" && s.listing.avgRating > 0
        ? s.listing.avgRating
        : null,
    reviews: s.listing.reviewCount ?? 0,
    savedAt: s.createdAt.toISOString(),
  }))

  return { items, total, hasMore: skip + items.length < total }
}

// ─── saveListing ──────────────────────────────────────────────────────────────

export async function saveListing(
  userId: string,
  listingId: string
): Promise<{ ok: true } | { ok: false; status: 404; message: string }> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true },
  })
  if (!listing) return { ok: false, status: 404, message: "Listing not found." }

  // Upsert prevents duplicate saves (idempotent)
  await prisma.savedListing.upsert({
    where: { userId_listingId: { userId, listingId } },
    update: {},
    create: { userId, listingId },
  })

  return { ok: true }
}

// ─── unsaveListing ────────────────────────────────────────────────────────────

export async function unsaveListing(
  userId: string,
  listingId: string
): Promise<{ ok: true } | { ok: false; status: 404; message: string }> {
  const existing = await prisma.savedListing.findUnique({
    where: { userId_listingId: { userId, listingId } },
    select: { userId: true },
  })
  if (!existing) return { ok: false, status: 404, message: "Saved listing not found." }

  await prisma.savedListing.delete({
    where: { userId_listingId: { userId, listingId } },
  })
  return { ok: true }
}

// ─── toggleSave ───────────────────────────────────────────────────────────────

export async function toggleSave(
  userId: string,
  listingId: string
): Promise<
  { ok: true; saved: boolean } | { ok: false; status: 404; message: string }
> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true },
  })
  if (!listing) return { ok: false, status: 404, message: "Listing not found." }

  const existing = await prisma.savedListing.findUnique({
    where: { userId_listingId: { userId, listingId } },
    select: { userId: true },
  })

  if (existing) {
    await prisma.savedListing.delete({
      where: { userId_listingId: { userId, listingId } },
    })
    return { ok: true, saved: false }
  } else {
    await prisma.savedListing.create({ data: { userId, listingId } })
    return { ok: true, saved: true }
  }
}

// ─── isSaved ──────────────────────────────────────────────────────────────────

export async function isSaved(userId: string, listingId: string): Promise<boolean> {
  const record = await prisma.savedListing.findUnique({
    where: { userId_listingId: { userId, listingId } },
    select: { userId: true },
  })
  return !!record
}

// ─── getSavedListingIds ───────────────────────────────────────────────────────
// Single efficient query — no N+1 on the browse listings page.

export async function getSavedListingIds(userId: string): Promise<Set<string>> {
  const saved = await prisma.savedListing.findMany({
    where: { userId },
    select: { listingId: true },
  })
  return new Set(saved.map((s) => s.listingId))
}
