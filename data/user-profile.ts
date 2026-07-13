import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserProfileReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  listing: {
    id: string;
    title: string;
    image: string | null;
  };
}

export interface UserProfileSavedListing {
  id: string;
  title: string;
  city: string;
  locality: string;
  rent: number;
  image: string | null;
  savedAt: Date;
}

export interface UserProfileRentedListing {
  id: string;
  title: string;
  city: string;
  locality: string;
  rent: number;
  image: string | null;
  rentedAt: Date;
}

export interface UserProfileData {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  memberSince: number; // year
  emailVerified: boolean;
  phoneVerified: boolean; // has phone on file
  rentalsCount: number; // all-time accepted booking requests
  reviews: UserProfileReview[];
  isOwnProfile: boolean;
  savedListings?: UserProfileSavedListing[];
  rentedListings?: UserProfileRentedListing[];
}

// ── Fallback avatar ───────────────────────────────────────────────────────────

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80";

// ── Main query ────────────────────────────────────────────────────────────────

/**
 * Fetches a user's public/private profile by id.
 *
 * - `viewerId` is the currently-authenticated user's id (if any).
 * - Private fields (phone verified status) are only included when
 *   `isOwnProfile` is true — but filtering happens in the view layer,
 *   this function is data-complete so the server component can decide.
 *
 * Returns null if no user matches the id.
 */
export async function getUserProfile(
  id: string,
  viewerId?: string,
): Promise<UserProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      createdAt: true,
      emailVerified: true,
      phone: true, // only used for boolean check, never exposed
    },
  });

  if (!user) return null;

  // Count all-time accepted booking requests (trust signal)
  // Using all-time rather than "recent N months" — an accepted request from
  // 2 years ago is still a valid trust signal, and filtering it out loses
  // information for no real user benefit.
  const rentalsCount = await prisma.bookingRequest.count({
    where: { userId: id, status: "ACCEPTED" },
  });

  // Fetch reviews written by this user (shown in both views)
  const reviews = await prisma.review.findMany({
    where: { userId: id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          images: {
            take: 1,
            orderBy: { sortOrder: "asc" },
            select: { url: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const mappedReviews: UserProfileReview[] = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    listing: {
      id: r.listing.id,
      title: r.listing.title,
      image: r.listing.images[0]?.url ?? null,
    },
  }));

  // Fetch saved listings if viewing own profile
  let savedListings: UserProfileSavedListing[] = [];
  if (viewerId === id) {
    const dbSaved = await prisma.savedListing.findMany({
      where: { userId: id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            city: true,
            locality: true,
            monthlyRent: true,
            images: {
              take: 1,
              orderBy: { sortOrder: "asc" },
              select: { url: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    savedListings = dbSaved.map((s) => ({
      id: s.listing.id,
      title: s.listing.title,
      city: s.listing.city,
      locality: s.listing.locality,
      rent: s.listing.monthlyRent,
      image: s.listing.images[0]?.url ?? null,
      savedAt: s.createdAt,
    }));
  }

  // Fetch rented listings (accepted booking requests) if viewing own profile
  let rentedListings: UserProfileRentedListing[] = [];
  if (viewerId === id) {
    const dbRented = await prisma.bookingRequest.findMany({
      where: { userId: id, status: "ACCEPTED" },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            city: true,
            locality: true,
            monthlyRent: true,
            images: {
              take: 1,
              orderBy: { sortOrder: "asc" },
              select: { url: true },
            },
          },
        },
      },
      orderBy: { respondedAt: "desc" },
    });
    // Deduplicate by listing ID to show unique rented properties
    const seen = new Set<string>();
    rentedListings = dbRented
      .filter((r) => {
        if (seen.has(r.listingId)) return false;
        seen.add(r.listingId);
        return true;
      })
      .map((r) => ({
        id: r.listing.id,
        title: r.listing.title,
        city: r.listing.city,
        locality: r.listing.locality,
        rent: r.listing.monthlyRent,
        image: r.listing.images[0]?.url ?? null,
        rentedAt: r.respondedAt ?? r.createdAt,
      }));
  }

  return {
    id: user.id,
    name: user.name ?? "StayZ User",
    image: user.image ?? FALLBACK_AVATAR,
    bio: user.bio ?? null,
    memberSince: user.createdAt.getFullYear(),
    emailVerified: user.emailVerified !== null,
    phoneVerified: user.phone !== null && user.phone.length > 0,
    rentalsCount,
    reviews: mappedReviews,
    isOwnProfile: viewerId === id,
    savedListings,
    rentedListings,
  };
}
