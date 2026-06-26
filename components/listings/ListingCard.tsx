"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Home, MapPin } from "lucide-react";
import type { Listing, ListingImage } from "@prisma/client";
import {
  ROOM_TYPE_LABELS,
  ROOM_TYPE_COLORS,
  FURNISHING_LABELS,
  FURNISHING_COLORS,
  GENDER_LABELS,
  GENDER_COLORS,
  formatRent,
} from "./listingConfig";

// ── Types ─────────────────────────────────────────────────────────────────────
export type ListingWithImage = Listing & { images: ListingImage[] };

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${colorClass}`}
    >
      {label}
    </span>
  );
}

// ── ListingCard ───────────────────────────────────────────────────────────────
export default function ListingCard({ listing }: { listing: ListingWithImage }) {
  const [wishlisted, setWishlisted] = useState(false);
  const thumb = listing.images[0];

  function handleWishlist(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((prev) => !prev);
    // TODO: POST /api/wishlist
  }

  return (
    <Link
      href={`/listings-details/${listing.id}`}
      id={`listing-card-${listing.id}`}
      className="group relative flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Thumbnail */}
      <div className="relative h-44 w-full shrink-0 bg-muted/30">
        {thumb ? (
          <Image
            src={thumb.url}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/30">
            <Home className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
          </div>
        )}

        {/* Wishlist heart — absolutely positioned top-right */}
        <button
          id={`wishlist-btn-${listing.id}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlist}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 transition-colors hover:bg-black/60 active:scale-90"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wishlisted
                ? "fill-primary stroke-primary"
                : "fill-transparent stroke-muted-foreground"
            }`}
          />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">
            {listing.locality}, {listing.city}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge
            label={ROOM_TYPE_LABELS[listing.roomType]}
            colorClass={ROOM_TYPE_COLORS[listing.roomType]}
          />
          <Badge
            label={FURNISHING_LABELS[listing.furnishing]}
            colorClass={FURNISHING_COLORS[listing.furnishing]}
          />
          <Badge
            label={GENDER_LABELS[listing.genderPreference]}
            colorClass={GENDER_COLORS[listing.genderPreference]}
          />
        </div>

        {/* Rent */}
        <p className="mt-auto text-base font-bold text-foreground">
          {formatRent(listing.monthlyRent)}
          <span className="text-xs font-normal text-muted-foreground">/mo</span>
        </p>
      </div>
    </Link>
  );
}
