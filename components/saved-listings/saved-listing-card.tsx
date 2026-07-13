"use client";

import { MapPin, Calendar, Eye, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ListingStatusBadge } from "@/components/my-listings/listing-status-badge";
import type { SavedListingDTO } from "@/types/listing";

// ─── Config ───────────────────────────────────────────────────────────────────

const ROOM_TYPE_LABELS: Record<string, string> = {
  SINGLE: "Single",
  SHARED: "Shared",
  PG: "PG",
  FLAT: "Flat",
};

const FURNISHING_LABELS: Record<string, string> = {
  FURNISHED: "Furnished",
  SEMI_FURNISHED: "Semi-Furnished",
  UNFURNISHED: "Bare",
};

const GENDER_LABELS: Record<string, string> = {
  ANY: "Any Gender",
  MALE: "Boys Only",
  FEMALE: "Girls Only",
};

// ─── MicroBadge ───────────────────────────────────────────────────────────────

function MicroBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide",
        className
      )}
    >
      {label}
    </span>
  );
}

// ─── SavedListingCard ─────────────────────────────────────────────────────────

interface SavedListingCardProps {
  listing: SavedListingDTO;
  onRemove: (id: string) => void;
  removing?: boolean;
}

export function SavedListingCard({
  listing,
  onRemove,
  removing = false,
}: SavedListingCardProps) {
  const savedDate = new Date(listing.savedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const genderClassName =
    listing.genderPreference === "MALE"
      ? "border-sky-500/25 bg-sky-500/10 text-sky-400"
      : listing.genderPreference === "FEMALE"
      ? "border-pink-500/25 bg-pink-500/10 text-pink-400"
      : "border-zinc-500/25 bg-zinc-500/10 text-zinc-400";

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07]",
        "bg-[#111]/80 backdrop-blur-sm",
        "shadow-[0_1px_2px_0_rgba(0,0,0,0.5)]",
        "transition-all duration-300 ease-out",
        "hover:border-white/[0.14] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.7)] hover:-translate-y-0.5",
        removing && "opacity-40 pointer-events-none scale-95"
      )}
    >
      {/* Cover image */}
      <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.coverImage}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Availability badge — top-right */}
        <div className="absolute top-3 right-3">
          <ListingStatusBadge status={listing.status} />
        </div>

        {/* Rent overlay — bottom-left */}
        <div className="absolute bottom-3 left-3">
          <span className="text-lg font-bold text-white drop-shadow-md">
            ₹{listing.rent.toLocaleString("en-IN")}
            <span className="text-xs font-normal text-white/70">/mo</span>
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground leading-snug group-hover:text-white/90 transition-colors">
          {listing.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {listing.locality}, {listing.city}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <MicroBadge
            label={ROOM_TYPE_LABELS[listing.roomType] ?? listing.roomType}
            className="border-blue-500/25 bg-blue-500/10 text-blue-400"
          />
          <MicroBadge
            label={FURNISHING_LABELS[listing.furnishing] ?? listing.furnishing}
            className="border-violet-500/25 bg-violet-500/10 text-violet-400"
          />
          <MicroBadge
            label={GENDER_LABELS[listing.genderPreference] ?? listing.genderPreference}
            className={genderClassName}
          />
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star
              className={cn(
                "h-3.5 w-3.5",
                listing.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40"
              )}
            />
            <span className={listing.rating ? "text-foreground font-medium" : ""}>
              {listing.rating ? listing.rating.toFixed(1) : "—"}
            </span>
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span>
            {listing.reviews}{" "}
            {listing.reviews === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
        {/* Saved date */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
          <Calendar className="h-3 w-3" />
          <span>Saved {savedDate}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* View details */}
          <Link
            href={`/listings-details/${listing.id}`}
            id={`saved-view-${listing.id}`}
            aria-label={`View details for ${listing.title}`}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md",
              "text-muted-foreground/60 transition-colors",
              "hover:bg-white/[0.07] hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>

          {/* Remove */}
          <button
            id={`saved-remove-${listing.id}`}
            aria-label={`Remove ${listing.title} from saved`}
            onClick={() => onRemove(listing.id)}
            disabled={removing}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md",
              "text-rose-400/60 transition-colors",
              "hover:bg-rose-500/10 hover:text-rose-400",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500/30",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
