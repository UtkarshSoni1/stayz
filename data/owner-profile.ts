import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OwnerProfileListing {
  id: string;
  title: string;
  city: string;
  locality: string;
  rent: number;
  image: string | null;
  status: string;
}

export interface OwnerPersonalDetail {
  icon: string;
  text: string;
}

export interface OwnerProfileData {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  joinedYear: number;
  isSuperhost: boolean;
  responseRate: string;
  responseTime: string;
  yearsHosting: number;
  // Aggregated across all owner's listings
  overallRating: number;
  overallReviewCount: number;
  personalDetails: OwnerPersonalDetail[];
  // contact — only populated for own profile
  phone?: string;
  whatsappNumber?: string;
  // Active listings (public), all listings (own profile)
  listings: OwnerProfileListing[];
  isOwnProfile: boolean;
}

// ── Fallback ──────────────────────────────────────────────────────────────────

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80";

// ── Main query ────────────────────────────────────────────────────────────────

/**
 * Fetches an owner's profile by id.
 *
 * - Returns null if the user does not exist OR is not an OWNER.
 *   Keeps /owners/[id] and /users/[id] namespaces distinct.
 * - `viewerId` is the authenticated session user's id.
 *   When viewerId === id the response is data-complete (contact info + all
 *   listing statuses); otherwise contact is stripped and only ACTIVE listings
 *   are returned.
 */
export async function getOwnerProfile(
  id: string,
  viewerId?: string,
): Promise<OwnerProfileData | null> {
  const owner = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      role: true,
      joinedYear: true,
      createdAt: true,
      isSuperhost: true,
      responseRate: true,
      responseTimeLabel: true,
      yearsHosting: true,
      phone: true,
      whatsappNumber: true,
      hostPersonalDetails: {
        orderBy: { id: "asc" },
        select: { icon: true, text: true },
      },
    },
  });

  // 404 if user doesn't exist or isn't an owner
  if (!owner || owner.role !== "OWNER") return null;

  const isOwnProfile = viewerId === id;

  // Aggregate rating/reviews across all this owner's listings in one query
  const reviewAgg = await prisma.review.aggregate({
    where: { listing: { ownerId: id } },
    _avg: { rating: true },
    _count: { id: true },
  });

  const overallRating = reviewAgg._avg.rating ?? 0;
  const overallReviewCount = reviewAgg._count.id;

  // Fetch listings — all statuses for own view, ACTIVE-only for public
  const listingWhere = isOwnProfile
    ? { ownerId: id }
    : { ownerId: id, status: "ACTIVE" as const };

  const dbListings = await prisma.listing.findMany({
    where: listingWhere,
    select: {
      id: true,
      title: true,
      city: true,
      locality: true,
      monthlyRent: true,
      status: true,
      images: {
        take: 1,
        orderBy: { sortOrder: "asc" },
        select: { url: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const listings: OwnerProfileListing[] = dbListings.map((l) => ({
    id: l.id,
    title: l.title,
    city: l.city,
    locality: l.locality,
    rent: l.monthlyRent,
    image: l.images[0]?.url ?? null,
    status: l.status,
  }));

  const joinedYear =
    owner.joinedYear ?? owner.createdAt.getFullYear();
  const yearsHosting =
    owner.yearsHosting ?? new Date().getFullYear() - joinedYear;

  return {
    id: owner.id,
    name: owner.name ?? "Owner",
    image: owner.image ?? FALLBACK_AVATAR,
    bio: owner.bio ?? null,
    joinedYear,
    isSuperhost: owner.isSuperhost,
    responseRate: owner.responseRate ?? "—",
    responseTime: owner.responseTimeLabel ?? "—",
    yearsHosting,
    overallRating,
    overallReviewCount,
    personalDetails: owner.hostPersonalDetails,
    phone: isOwnProfile ? (owner.phone ?? undefined) : undefined,
    whatsappNumber: isOwnProfile ? (owner.whatsappNumber ?? undefined) : undefined,
    listings,
    isOwnProfile,
  };
}
