import { prisma } from "@/lib/prisma";
import type {
  Listing,
  NavLink,
  Host,
  RatingBreakdown,
} from "@/types/listing-detail";

// ── Static nav links (used by ListingNavBar) ──────────────────────────────────
export const listingNavLinks: NavLink[] = [
  { label: "Photos",    href: "#photos" },
  { label: "Amenities", href: "#amenities" },
  { label: "Reviews",   href: "#reviews" },
  { label: "Location",  href: "#location" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export function formatCurrency(
  amount: number | null | undefined,
  currency: string,
): string {
  if (amount == null || Number.isNaN(amount)) {
    return `${currency}0`;
  }

  return `${currency}${amount.toLocaleString("en-IN")}`;
}

/** ISO date string → "Month YYYY" label for review cards */
function formatReviewDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

/** Fallback host avatar — generic illustrated avatar */
const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80";

// ── Main query ────────────────────────────────────────────────────────────────

/**
 * Fetches a listing by id from the database and maps it to the Listing type
 * expected by all listing-detail components.
 *
 * Returns null if no listing matches the id.
 */
export async function getListingById(id: string): Promise<Listing | null> {
  const row = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      highlights: { orderBy: { sortOrder: "asc" } },
      amenities: {
        include: {
          amenity: true,
        },
      },
      sleepingArrangements: { orderBy: { sortOrder: "asc" } },
      thingsToKnow: { orderBy: { sortOrder: "asc" } },
      reviews: {
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          image: true,
          isSuperhost: true,
          responseRate: true,
          responseTimeLabel: true,
          yearsHosting: true,
          joinedYear: true,
          createdAt: true,
          phone: true,
          whatsappNumber: true,
          hostPersonalDetails: {
            orderBy: { id: "asc" },
          },
        },
      },
    },
  });

  if (!row) return null;

  // ── Map photos ──────────────────────────────────────────────────────────────
  const photos = row.images.map((img) => ({
    src: img.url,
    alt: img.alt ?? row.title,
  }));

  // ── Map host ────────────────────────────────────────────────────────────────
  const ownerJoinedYear =
    row.owner.joinedYear ?? row.owner.createdAt.getFullYear();

  const host: Host = {
    id: row.owner.id,
    name: row.owner.name ?? "Host",
    avatarUrl: row.owner.image ?? FALLBACK_AVATAR,
    avatarAlt: `${row.owner.name ?? "Host"} profile photo`,
    joinedYear: ownerJoinedYear,
    responseRate: row.owner.responseRate ?? "—",
    responseTime: row.owner.responseTimeLabel ?? "—",
    isSuperhost: row.owner.isSuperhost,
    reviewCount: row.reviewCount,
    rating: row.avgRating,
    yearsHosting:
      row.owner.yearsHosting ??
      new Date().getFullYear() - ownerJoinedYear,
    personalDetails: row.owner.hostPersonalDetails.map((d) => ({
      icon: d.icon,
      text: d.text,
    })),
    superhostDescription:
      "Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.",
    safetyDisclaimer:
      "To protect your payment, always use StayZ to send money and communicate with hosts.",
    // Contact fields — populated by owner from their dashboard settings
    phone: row.owner.phone ?? undefined,
    whatsappNumber: row.owner.whatsappNumber ?? undefined,
  };

  // ── Map highlights ──────────────────────────────────────────────────────────
  const highlights = row.highlights.map((h) => ({
    id: h.id,
    icon: h.icon,
    title: h.title,
    description: h.description,
  }));

  // ── Map amenities ───────────────────────────────────────────────────────────
  const amenities = row.amenities.map(({ amenity }) => ({
    id: amenity.id,
    icon: amenity.icon ?? "check",
    title: amenity.name,
    description: amenity.description ?? "",
  }));

  // ── Map rating breakdown (from denormalised listing fields) ─────────────────
  const ratingBreakdown: RatingBreakdown = {
    overall: row.avgRating,
    reviewCount: row.reviewCount,
    categories: [
      { label: "Cleanliness",   score: row.avgCleanliness },
      { label: "Accuracy",      score: row.avgAccuracy },
      { label: "Check-in",      score: row.avgCheckIn },
      { label: "Communication", score: row.avgCommunication },
      { label: "Location",      score: row.avgLocation },
      { label: "Value",         score: row.avgValue },
    ],
  };

  // ── Map reviews ─────────────────────────────────────────────────────────────
  const reviews = row.reviews.map((r) => ({
    id: r.id,
    author: r.user.name ?? "Guest",
    avatarUrl: r.user.image ?? FALLBACK_AVATAR,
    avatarAlt: `${r.user.name ?? "Guest"} profile photo`,
    date: formatReviewDate(r.createdAt),
    rating: r.rating,
    comment: r.comment ?? "",
  }));

  // ── Map sleeping arrangements ───────────────────────────────────────────────
  const sleepingArrangements = row.sleepingArrangements.map((s) => ({
    id: s.id,
    icon: s.icon,
    name: s.name,
    description: s.description,
  }));

  // ── Map things to know ──────────────────────────────────────────────────────
  const thingsToKnow = row.thingsToKnow.map((t) => ({
    id: t.id,
    icon: t.icon,
    title: t.title,
    content: t.content,
  }));

  // ── Map booking info (rental-platform model: monthly rent + deposit) ─────────
  const booking = {
    monthlyRent: row.monthlyRent,
    currency: "₹",
    rating: row.avgRating,
    deposit: row.deposit ?? undefined,
    maxGuests: row.guests,
    reserveLabel: "Contact Owner",
    listingId: row.id,
    listingTitle: row.title,
    status: row.status,
  };

  // ── Assemble final Listing object ───────────────────────────────────────────
  return {
    id: row.id,
    title: row.title,
    propertyType: row.propertyType,
    location: `${row.locality}, ${row.city}`,
    guests: row.guests,
    bedrooms: row.bedrooms,
    beds: row.beds,
    bathrooms: row.bathrooms,
    photos,
    host,
    highlights,
    amenities,
    description: row.description,
    descriptionExtended: row.descriptionExtended ?? "",
    booking,
    reviews,
    ratingBreakdown,
    sleepingArrangements,
    thingsToKnow,
    mapLocation: `${row.locality}, ${row.city}`,
    mapImageUrl: row.mapImageUrl ?? "",
    mapImageAlt: `Map view of ${row.locality}, ${row.city}`,
  };
}
