import { cn } from "@/lib/utils"
import type { Role, AccountStatus, ReportStatus } from "@prisma/client"

// ─── Role Badge ───────────────────────────────────────────────────────────────

const roleConfig: Record<Role, { label: string; className: string }> = {
  USER: {
    label: "User",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  OWNER: {
    label: "Owner",
    className: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  ADMIN: {
    label: "Admin",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
}

export function RoleBadge({ role }: { role: Role }) {
  const cfg = roleConfig[role]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className
      )}
    >
      {cfg.label}
    </span>
  )
}

// ─── Account Status Badge ─────────────────────────────────────────────────────

const accountStatusConfig: Record<
  AccountStatus,
  { label: string; className: string; dot: string }
> = {
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    dot: "bg-orange-400",
  },
  BANNED: {
    label: "Banned",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
}

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  const cfg = accountStatusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  )
}

// ─── Verification Badge ───────────────────────────────────────────────────────

export function VerificationBadge({
  verified,
}: {
  verified: boolean
}) {
  return verified ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/40">
      Unverified
    </span>
  )
}

// ─── Report Status Badge ──────────────────────────────────────────────────────

const reportStatusConfig: Record<
  ReportStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  DISMISSED: {
    label: "Dismissed",
    className: "bg-white/5 text-white/40 border-white/10",
  },
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const cfg = reportStatusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.className
      )}
    >
      {cfg.label}
    </span>
  )
}

// ─── Report Type Badge ────────────────────────────────────────────────────────

export function ReportTypeBadge({ type }: { type: "USER" | "LISTING" }) {
  return type === "USER" ? (
    <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
      User
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-400">
      Listing
    </span>
  )
}
