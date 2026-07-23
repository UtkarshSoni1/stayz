"use client";

import { cn } from "@/lib/utils";

export type ListingStatus = "ACTIVE" | "DRAFT" | "RENTED" | "SUSPENDED";

const statusConfig: Record<
  ListingStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-stayz-status-success text-stayz-status-success-fg border-stayz-status-success-fg/30 shadow-stayz-status-success/10",
  },
  DRAFT: {
    label: "Draft",
    className:
      "bg-stayz-status-neutral text-stayz-status-neutral-fg border-stayz-status-neutral-fg/30 shadow-stayz-status-neutral/10",
  },
  RENTED: {
    label: "Rented",
    className:
      "bg-stayz-status-neutral text-stayz-status-neutral-fg border-stayz-status-neutral-fg/30 shadow-stayz-status-neutral/10",
  },
  SUSPENDED: {
    label: "Suspended",
    className:
      "bg-stayz-status-error text-stayz-status-error-fg border-stayz-status-error-fg/30 shadow-stayz-status-error/10",
  },
};

const statusDot: Record<ListingStatus, string> = {
  ACTIVE: "bg-stayz-status-success-fg",
  DRAFT: "bg-stayz-status-neutral-fg",
  RENTED: "bg-stayz-status-neutral-fg",
  SUSPENDED: "bg-stayz-status-error-fg",
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
