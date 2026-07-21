"use client";

import { useState, useCallback, useTransition } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Home,
  UserX,
  UserCheck,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PaginationBar } from "@/components/admin/pagination-bar";
import {
  AccountStatusBadge,
  VerificationBadge,
} from "@/components/admin/status-badge";
import type { AdminOwnerDTO, PaginatedResponse } from "@/types/admin";
import type { AccountStatus } from "@prisma/client";

// ─── Action Menu ───────────────────────────────────────────────────────────────

function ActionMenu({
  owner,
  onView,
  onViewListings,
  onSuspend,
  onActivate,
}: {
  owner: AdminOwnerDTO;
  onView: () => void;
  onViewListings: () => void;
  onSuspend: () => void;
  onActivate: () => void;
}) {
  const [open, setOpen] = useState(false);

  const items = [
    { icon: Eye, label: "View Profile", action: onView },
    { icon: Home, label: "View Listings", action: onViewListings },
    ...(owner.accountStatus === "ACTIVE"
      ? [{ icon: UserX, label: "Suspend", action: onSuspend, danger: true }]
      : [{ icon: UserCheck, label: "Activate", action: onActivate }]),
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/[0.06]"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-white/[0.08] bg-[#1a1a1a] py-1 shadow-xl shadow-black/40">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  item.action();
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                  item.danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ data }: { data: AdminOwnerDTO[] }) {
  const active = data.filter((o) => o.accountStatus === "ACTIVE").length;
  const suspended = data.filter((o) => o.accountStatus === "SUSPENDED").length;
  const verified = data.filter((o) => !!o.emailVerified).length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {[
        { label: "Active", value: active, color: "text-emerald-400" },
        { label: "Suspended", value: suspended, color: "text-orange-400" },
        { label: "Verified", value: verified, color: "text-blue-400" },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          className="rounded-xl border border-white/[0.06] bg-[#111] px-4 py-3"
        >
          <p className={`text-xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-white/40 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-4">
        <Building2 className="h-7 w-7 text-white/20" />
      </div>
      <p className="text-sm font-medium text-white/50">
        {hasFilters ? "No owners match your filters" : "No owners yet"}
      </p>
      <p className="mt-1 text-xs text-white/30">
        {hasFilters
          ? "Try adjusting your search or filter criteria."
          : "Owners will appear here once users create their first listing."}
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface OwnersClientProps {
  initialData: PaginatedResponse<AdminOwnerDTO>;
  initialSearch: string;
  initialStatus: string;
}

function OwnersClientInner({
  initialData,
  initialSearch,
  initialStatus,
}: OwnersClientProps) {
  const { toast } = useToast();
  const [, startTransition] = useTransition();

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(initialData.page);

  const [confirmSuspend, setConfirmSuspend] = useState<AdminOwnerDTO | null>(null);
  const [confirmActivate, setConfirmActivate] = useState<AdminOwnerDTO | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────────
  const fetchOwners = useCallback(
    async (opts: { search?: string; status?: string; page?: number }) => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (opts.search) p.set("search", opts.search);
        if (opts.status && opts.status !== "ALL") p.set("accountStatus", opts.status);
        if (opts.page && opts.page > 1) p.set("page", String(opts.page));

        const res = await fetch(`/api/admin/owners?${p.toString()}`);
        const json = await res.json();
        if (json.success) setData(json.data);
        else toast("Failed to load owners.", "error");
      } catch {
        toast("Network error.", "error");
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const applyFilters = (newSearch: string, newStatus: string, newPage = 1) => {
    setSearch(newSearch);
    setStatus(newStatus);
    setPage(newPage);
    startTransition(() => {
      fetchOwners({ search: newSearch, status: newStatus, page: newPage });
    });
  };

  // ── Patch helper ──────────────────────────────────────────────────────────────
  const patchOwner = async (id: string, payload: { accountStatus: AccountStatus }) => {
    const res = await fetch(`/api/admin/owners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.success) {
      setData((prev) => ({
        ...prev,
        data: prev.data.map((o) =>
          o.id === id ? { ...o, ...payload } : o
        ),
      }));
      return true;
    }
    toast(json.error ?? "Action failed.", "error");
    return false;
  };

  const handleSuspend = async () => {
    if (!confirmSuspend) return;
    setActionLoading(true);
    const ok = await patchOwner(confirmSuspend.id, { accountStatus: "SUSPENDED" });
    if (ok) toast("Owner suspended.", "success");
    setConfirmSuspend(null);
    setActionLoading(false);
  };

  const handleActivate = async () => {
    if (!confirmActivate) return;
    setActionLoading(true);
    const ok = await patchOwner(confirmActivate.id, { accountStatus: "ACTIVE" });
    if (ok) toast("Owner activated.", "success");
    setConfirmActivate(null);
    setActionLoading(false);
  };

  const hasFilters = search !== "" || status !== "ALL";

  return (
    <>
      <StatsBar data={data.data} />

      {/* ── Toolbar ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search by name, email, or ID…"
              value={search}
              onChange={(e) => applyFilters(e.target.value, status)}
              className="pl-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30"
            />
          </div>
          <Select value={status} onValueChange={(v) => applyFilters(search, v)}>
            <SelectTrigger className="w-full sm:w-40 bg-white/[0.04] border-white/[0.08] text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.08] text-white">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="BANNED">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Table / Cards ─────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111] overflow-hidden">
        {loading ? (
          <div className="divide-y divide-white/[0.04]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-9 w-9 rounded-full bg-white/[0.05] animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-white/[0.05] rounded animate-pulse" />
                  <div className="h-2.5 w-48 bg-white/[0.04] rounded animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-white/[0.05] rounded-full animate-pulse" />
                <div className="h-5 w-10 bg-white/[0.04] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Owner", "Status", "Verified", "Listings", "Joined", ""].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-medium text-white/30 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {data.data.map((o) => (
                    <tr
                      key={o.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Owner */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-sm font-semibold text-violet-400">
                            {(o.name?.[0] ?? o.email[0]).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate max-w-[180px]">
                              {o.name ?? <span className="text-white/30 italic">No name</span>}
                            </p>
                            <p className="text-xs text-white/40 truncate max-w-[180px]">
                              {o.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <AccountStatusBadge status={o.accountStatus} />
                      </td>
                      {/* Verified */}
                      <td className="px-5 py-4">
                        <VerificationBadge verified={!!o.emailVerified} />
                      </td>
                      {/* Listings */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-white">
                            {o._count.listings}
                          </span>
                          <span className="text-xs text-white/30">listings</span>
                        </div>
                      </td>
                      {/* Joined */}
                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <ActionMenu
                          owner={o}
                          onView={() => window.open(`/owner-profile/${o.id}`, "_blank")}
                          onViewListings={() => window.open(`/listings?ownerId=${o.id}`, "_blank")}
                          onSuspend={() => setConfirmSuspend(o)}
                          onActivate={() => setConfirmActivate(o)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/[0.04]">
              {data.data.map((o) => (
                <div key={o.id} className="px-4 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-sm font-semibold text-violet-400">
                        {(o.name?.[0] ?? o.email[0]).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {o.name ?? <span className="text-white/30 italic">No name</span>}
                        </p>
                        <p className="text-xs text-white/40">{o.email}</p>
                      </div>
                    </div>
                    <ActionMenu
                      owner={o}
                      onView={() => window.open(`/owner-profile/${o.id}`, "_blank")}
                      onViewListings={() => window.open(`/listings?ownerId=${o.id}`, "_blank")}
                      onSuspend={() => setConfirmSuspend(o)}
                      onActivate={() => setConfirmActivate(o)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pl-11">
                    <AccountStatusBadge status={o.accountStatus} />
                    <VerificationBadge verified={!!o.emailVerified} />
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/50">
                      {o._count.listings} listings
                    </span>
                    <span className="text-[10px] text-white/30">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {data.data.length > 0 && (
          <div className="px-5 pb-5">
            <PaginationBar
              page={page}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={data.pageSize}
              onPageChange={(p) => applyFilters(search, status, p)}
            />
          </div>
        )}
      </div>

      {/* ── Dialogs ───────────────────────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!confirmSuspend}
        onOpenChange={(v) => !v && setConfirmSuspend(null)}
        title="Suspend Owner"
        description={`This will suspend ${confirmSuspend?.name ?? confirmSuspend?.email}'s account. Their listings will remain but they won't be able to log in.`}
        confirmLabel="Suspend"
        variant="warning"
        loading={actionLoading}
        onConfirm={handleSuspend}
      />

      <ConfirmDialog
        open={!!confirmActivate}
        onOpenChange={(v) => !v && setConfirmActivate(null)}
        title="Activate Owner"
        description={`This will restore full access for ${confirmActivate?.name ?? confirmActivate?.email}.`}
        confirmLabel="Activate"
        variant="warning"
        loading={actionLoading}
        onConfirm={handleActivate}
      />
    </>
  );
}

export function OwnersClient(props: OwnersClientProps) {
  return (
    <ToastProvider>
      <OwnersClientInner {...props} />
    </ToastProvider>
  );
}
