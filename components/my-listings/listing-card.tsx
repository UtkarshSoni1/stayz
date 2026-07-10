"use client";

import { MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { ListingStatusBadge } from "./listing-status-badge";
import { ListingStats } from "./listing-stats";
import { ListingActions } from "./listing-actions";
import type { MyListing, RoomType, Furnishing, GenderPreference } from "./types";

// ── Config ────────────────────────────────────────────────────────────────────

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  SINGLE: "Single",
  SHARED: "Shared",
  PG: "PG",
  FLAT: "Flat",
};

const FURNISHING_LABELS: Record<Furnishing, string> = {
  FURNISHED: "Furnished",
  SEMI_FURNISHED: "Semi-Furnished",
  UNFURNISHED: "Bare",
};

const GENDER_LABELS: Record<GenderPreference, string> = {
  ANY: "Any Gender",
  MALE: "Boys Only",
  FEMALE: "Girls Only",
};

// ── Tiny badge ─────────────────────────────────────────────────────────────────

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

// ── Component ──────────────────────────────────────────────────────────────────

interface ListingCardProps {
  listing: MyListing;
  onDuplicate: (id: string) => void;
  onMarkRented: (id: string) => void;
  onMarkAvailable: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ListingCard({
  listing,
  onDuplicate,
  onMarkRented,
  onMarkAvailable,
  onDelete,
}: ListingCardProps) {
  const formattedDate = new Date(listing.createdAt).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07]",
        "bg-[#111]/80 backdrop-blur-sm",
        "shadow-[0_1px_2px_0_rgba(0,0,0,0.5)]",
        "transition-all duration-300 ease-out",
        "hover:border-white/[0.14] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.7)] hover:-translate-y-0.5",
        "cursor-pointer"
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

        {/* Status badge - top right on image */}
        <div className="absolute top-3 right-3">
          <ListingStatusBadge status={listing.status} />
        </div>

        {/* Rent - bottom left on image */}
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
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground leading-snug">
          {listing.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {listing.locality}, {listing.city}
          </span>
        </div>

        {/* Badge row */}
        <div className="flex flex-wrap gap-1.5">
          <MicroBadge
            label={ROOM_TYPE_LABELS[listing.roomType]}
            className="border-blue-500/25 bg-blue-500/10 text-blue-400"
          />
          <MicroBadge
            label={FURNISHING_LABELS[listing.furnishing]}
            className="border-violet-500/25 bg-violet-500/10 text-violet-400"
          />
          <MicroBadge
            label={GENDER_LABELS[listing.genderPreference]}
            className={cn(
              "border-pink-500/25 bg-pink-500/10",
              listing.genderPreference === "MALE"
                ? "border-sky-500/25 bg-sky-500/10 text-sky-400"
                : listing.genderPreference === "FEMALE"
                ? "text-pink-400"
                : "text-zinc-400 border-zinc-500/25 bg-zinc-500/10"
            )}
          />
        </div>

        {/* Stats */}
        <ListingStats
          rating={listing.rating}
          reviews={listing.reviews}
          saves={listing.saves}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
        {/* Created date */}
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
          <Calendar className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>

        {/* Actions */}
        <ListingActions
          listing={listing}
          onDuplicate={onDuplicate}
          onMarkRented={onMarkRented}
          onMarkAvailable={onMarkAvailable}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
