"use client";

import { cn } from "@/lib/utils";

export type ListingStatus = "ACTIVE" | "DRAFT" | "RENTED";

const statusConfig: Record<
  ListingStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10",
  },
  DRAFT: {
    label: "Draft",
    className:
      "bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-amber-500/10",
  },
  RENTED: {
    label: "Rented",
    className:
      "bg-zinc-500/15 text-zinc-400 border-zinc-500/30 shadow-zinc-500/10",
  },
};

const statusDot: Record<ListingStatus, string> = {
  ACTIVE: "bg-emerald-400",
  DRAFT: "bg-amber-400",
  RENTED: "bg-zinc-400",
};

interface ListingStatusBadgeProps {
  status: ListingStatus;
  className?: string;
}

export function ListingStatusBadge({
  status,
  className,
}: ListingStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide shadow-sm",
        config.className,
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", statusDot[status])}
        aria-hidden
      />
      {config.label}
    </span>
  );
}
