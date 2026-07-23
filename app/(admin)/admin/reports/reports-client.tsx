"use client";

import { useState, useCallback, useTransition } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertTriangle,
  Flag,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PaginationBar } from "@/components/admin/pagination-bar";
import {
  ReportStatusBadge,
  ReportTypeBadge,
} from "@/components/admin/status-badge";
import type { AdminReportDTO, PaginatedResponse } from "@/types/admin";

// ─── Action Menu ───────────────────────────────────────────────────────────────

function ActionMenu({
  report,
  onView,
  onResolve,
  onDismiss,
  onDelete,
}: {
  report: AdminReportDTO;
  onView: () => void;
  onResolve: () => void;
  onDismiss: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  const items = [
    { icon: Eye, label: "View Details", action: onView },
    ...(report.status !== "RESOLVED"
      ? [{ icon: CheckCircle2, label: "Resolve", action: onResolve }]
      : []),
    ...(report.status !== "DISMISSED"
      ? [{ icon: XCircle, label: "Dismiss", action: onDismiss }]
      : []),
    { icon: Trash2, label: "Delete", action: onDelete, danger: true },
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

// ─── View Dialog ───────────────────────────────────────────────────────────────

function ViewReportDialog({
  report,
  open,
  onOpenChange,
  onResolve,
  onDismiss,
}: {
  report: AdminReportDTO | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onResolve: (id: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
}) {
  const [acting, setActing] = useState<"resolve" | "dismiss" | null>(null);

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] border-white/[0.08] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Flag className="h-4 w-4 text-orange-400" />
            Report Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type + Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <ReportTypeBadge type={report.reportType} />
            <ReportStatusBadge status={report.status} />
          </div>

          {/* Reason */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs text-white/40 mb-1.5">Reason</p>
            <p className="text-sm text-white font-medium">{report.reason}</p>
            {report.description && (
              <p className="mt-2 text-xs text-white/50 leading-relaxed">
                {report.description}
              </p>
            )}
          </div>

          {/* Reporter */}
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            {[
              ["Reporter", `${report.reporter.name ?? "Unknown"} (${report.reporter.email})`],
              ...(report.reportedUser
                ? [["Reported User", `${report.reportedUser.name ?? "Unknown"} (${report.reportedUser.email})`]]
                : []),
              ...(report.reportedListing
                ? [["Reported Listing", `${report.reportedListing.title} — ${report.reportedListing.city}`]]
                : []),
              ["Created", new Date(report.createdAt).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 px-4 py-3 border-b border-white/[0.04] last:border-0"
              >
                <span className="text-xs text-white/40 shrink-0 pt-0.5">{label}</span>
                <span className="text-xs text-white text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/5"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {report.status !== "DISMISSED" && (
            <Button
              className="bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
              disabled={!!acting}
              onClick={async () => {
                setActing("dismiss");
                await onDismiss(report.id);
                setActing(null);
                onOpenChange(false);
              }}
            >
              {acting === "dismiss" ? "Dismissing…" : "Dismiss"}
            </Button>
          )}
          {report.status !== "RESOLVED" && (
            <Button
              className="bg-stayz-status-success text-stayz-status-success-fg border border-stayz-status-success-fg/20 hover:bg-stayz-status-success/80"
              disabled={!!acting}
              onClick={async () => {
                setActing("resolve");
                await onResolve(report.id);
                setActing(null);
                onOpenChange(false);
              }}
            >
              {acting === "resolve" ? "Resolving…" : "Mark Resolved"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ total, pending, resolved, dismissed }: {
  total: number; pending: number; resolved: number; dismissed: number
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {[
        { label: "Total", value: total, color: "text-white" },
        { label: "Pending", value: pending, color: "text-orange-400" },
        { label: "Resolved", value: resolved, color: "text-emerald-400" },
        { label: "Dismissed", value: dismissed, color: "text-white/40" },
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
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/5 border border-orange-500/10">
          <AlertTriangle className="h-8 w-8 text-orange-400/30" />
        </div>
      </div>
      <p className="text-base font-semibold text-white/40">
        {hasFilters ? "No reports match your filters" : "No reports yet"}
      </p>
      <p className="mt-2 text-sm text-white/25 max-w-xs">
        {hasFilters
          ? "Try adjusting your search or filter criteria to find reports."
          : "When users submit reports about content or accounts, they will appear here for review."}
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface ReportsClientProps {
  initialData: PaginatedResponse<AdminReportDTO>;
  initialSearch: string;
  initialStatus: string;
  initialType: string;
}

function ReportsClientInner({
  initialData,
  initialSearch,
  initialStatus,
  initialType,
}: ReportsClientProps) {
  const { toast } = useToast();
  const [, startTransition] = useTransition();

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [reportType, setReportType] = useState(initialType);
  const [page, setPage] = useState(initialData.page);

  const [viewReport, setViewReport] = useState<AdminReportDTO | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminReportDTO | null>(null);
  const [confirmResolve, setConfirmResolve] = useState<AdminReportDTO | null>(null);
  const [confirmDismiss, setConfirmDismiss] = useState<AdminReportDTO | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────────
  const fetchReports = useCallback(
    async (opts: { search?: string; status?: string; reportType?: string; page?: number }) => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        if (opts.search) p.set("search", opts.search);
        if (opts.status && opts.status !== "ALL") p.set("status", opts.status);
        if (opts.reportType && opts.reportType !== "ALL") p.set("reportType", opts.reportType);
        if (opts.page && opts.page > 1) p.set("page", String(opts.page));

        const res = await fetch(`/api/admin/reports?${p.toString()}`);
        const json = await res.json();
        if (json.success) setData(json.data);
        else toast("Failed to load reports.", "error");
      } catch {
        toast("Network error.", "error");
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const applyFilters = (
    s: string,
    st: string,
    rt: string,
    pg = 1
  ) => {
    setSearch(s);
    setStatus(st);
    setReportType(rt);
    setPage(pg);
    startTransition(() => {
      fetchReports({ search: s, status: st, reportType: rt, page: pg });
    });
  };

  // ── Status update helper ──────────────────────────────────────────────────────
  const updateStatus = async (id: string, newStatus: "RESOLVED" | "DISMISSED") => {
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const json = await res.json();
    if (json.success) {
      setData((prev) => ({
        ...prev,
        data: prev.data.map((r) =>
          r.id === id ? { ...r, status: newStatus } : r
        ),
      }));
      return true;
    }
    toast(json.error ?? "Action failed.", "error");
    return false;
  };

  const handleResolve = async (id: string) => {
    const ok = await updateStatus(id, "RESOLVED");
    if (ok) toast("Report marked as resolved.", "success");
  };

  const handleDismiss = async (id: string) => {
    const ok = await updateStatus(id, "DISMISSED");
    if (ok) toast("Report dismissed.", "success");
  };

  const handleConfirmResolve = async () => {
    if (!confirmResolve) return;
    setActionLoading(true);
    await handleResolve(confirmResolve.id);
    setConfirmResolve(null);
    setActionLoading(false);
  };

  const handleConfirmDismiss = async () => {
    if (!confirmDismiss) return;
    setActionLoading(true);
    await handleDismiss(confirmDismiss.id);
    setConfirmDismiss(null);
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setActionLoading(true);
    const res = await fetch(`/api/admin/reports/${confirmDelete.id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.success) {
      setData((prev) => ({
        ...prev,
        data: prev.data.filter((r) => r.id !== confirmDelete.id),
        total: prev.total - 1,
      }));
      toast("Report deleted.", "success");
    } else {
      toast(json.error ?? "Delete failed.", "error");
    }
    setConfirmDelete(null);
    setActionLoading(false);
  };

  const pending = data.data.filter((r) => r.status === "PENDING").length;
  const resolved = data.data.filter((r) => r.status === "RESOLVED").length;
  const dismissed = data.data.filter((r) => r.status === "DISMISSED").length;
  const hasFilters = search !== "" || status !== "ALL" || reportType !== "ALL";

  return (
    <>
      <StatsBar
        total={data.total}
        pending={pending}
        resolved={resolved}
        dismissed={dismissed}
      />

      {/* ── Toolbar ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-5 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search by reason or reporter…"
              value={search}
              onChange={(e) => applyFilters(e.target.value, status, reportType)}
              className="pl-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30"
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => applyFilters(search, v, reportType)}
          >
            <SelectTrigger className="w-full sm:w-36 bg-white/[0.04] border-white/[0.08] text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.08] text-white">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="DISMISSED">Dismissed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={reportType}
            onValueChange={(v) => applyFilters(search, status, v)}
          >
            <SelectTrigger className="w-full sm:w-36 bg-white/[0.04] border-white/[0.08] text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/[0.08] text-white">
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="LISTING">Listing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111] overflow-hidden">
        {loading ? (
          <div className="divide-y divide-white/[0.04]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="h-8 w-16 bg-white/[0.05] rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 bg-white/[0.05] rounded animate-pulse" />
                  <div className="h-2.5 w-32 bg-white/[0.04] rounded animate-pulse" />
                </div>
                <div className="h-5 w-20 bg-white/[0.05] rounded-full animate-pulse" />
                <div className="h-5 w-14 bg-white/[0.04] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Type", "Reason", "Reporter", "Target", "Status", "Date", ""].map((h) => (
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
                  {data.data.map((r) => (
                    <tr
                      key={r.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Type */}
                      <td className="px-5 py-4">
                        <ReportTypeBadge type={r.reportType} />
                      </td>
                      {/* Reason */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-white truncate max-w-[180px]">
                          {r.reason}
                        </p>
                      </td>
                      {/* Reporter */}
                      <td className="px-5 py-4">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white/80 truncate max-w-[140px]">
                            {r.reporter.name ?? "Unknown"}
                          </p>
                          <p className="text-[10px] text-white/40 truncate max-w-[140px]">
                            {r.reporter.email}
                          </p>
                        </div>
                      </td>
                      {/* Target */}
                      <td className="px-5 py-4">
                        {r.reportedUser ? (
                          <div>
                            <p className="text-xs text-white/70 truncate max-w-[140px]">
                              {r.reportedUser.name ?? r.reportedUser.email}
                            </p>
                            <p className="text-[10px] text-white/30">User</p>
                          </div>
                        ) : r.reportedListing ? (
                          <div>
                            <p className="text-xs text-white/70 truncate max-w-[140px]">
                              {r.reportedListing.title}
                            </p>
                            <p className="text-[10px] text-white/30">{r.reportedListing.city}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-white/20">—</span>
                        )}
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <ReportStatusBadge status={r.status} />
                      </td>
                      {/* Date */}
                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50">
                          {new Date(r.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <ActionMenu
                          report={r}
                          onView={() => setViewReport(r)}
                          onResolve={() => setConfirmResolve(r)}
                          onDismiss={() => setConfirmDismiss(r)}
                          onDelete={() => setConfirmDelete(r)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/tablet cards */}
            <div className="lg:hidden divide-y divide-white/[0.04]">
              {data.data.map((r) => (
                <div key={r.id} className="px-4 py-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <ReportTypeBadge type={r.reportType} />
                        <ReportStatusBadge status={r.status} />
                      </div>
                      <p className="text-sm font-medium text-white truncate">
                        {r.reason}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        by {r.reporter.name ?? r.reporter.email}
                      </p>
                    </div>
                    <ActionMenu
                      report={r}
                      onView={() => setViewReport(r)}
                      onResolve={() => setConfirmResolve(r)}
                      onDismiss={() => setConfirmDismiss(r)}
                      onDelete={() => setConfirmDelete(r)}
                    />
                  </div>
                  {(r.reportedUser || r.reportedListing) && (
                    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2">
                      <p className="text-[10px] text-white/30 mb-0.5">Target</p>
                      <p className="text-xs text-white/60">
                        {r.reportedUser
                          ? r.reportedUser.name ?? r.reportedUser.email
                          : r.reportedListing?.title}
                      </p>
                    </div>
                  )}
                  <p className="text-[10px] text-white/30 pl-0.5">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
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
              onPageChange={(p) => applyFilters(search, status, reportType, p)}
            />
          </div>
        )}
      </div>

      {/* ── Dialogs ───────────────────────────────────────────────────────────── */}
      <ViewReportDialog
        report={viewReport}
        open={!!viewReport}
        onOpenChange={(v) => !v && setViewReport(null)}
        onResolve={handleResolve}
        onDismiss={handleDismiss}
      />

      <ConfirmDialog
        open={!!confirmResolve}
        onOpenChange={(v) => !v && setConfirmResolve(null)}
        title="Resolve Report"
        description="Mark this report as resolved. This action can be tracked but not fully undone."
        confirmLabel="Mark Resolved"
        variant="warning"
        loading={actionLoading}
        onConfirm={handleConfirmResolve}
      />

      <ConfirmDialog
        open={!!confirmDismiss}
        onOpenChange={(v) => !v && setConfirmDismiss(null)}
        title="Dismiss Report"
        description="Dismiss this report as invalid or not actionable."
        confirmLabel="Dismiss"
        variant="warning"
        loading={actionLoading}
        onConfirm={handleConfirmDismiss}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(v) => !v && setConfirmDelete(null)}
        title="Delete Report"
        description="This will permanently delete this report record. This cannot be undone."
        confirmLabel="Delete Permanently"
        variant="destructive"
        loading={actionLoading}
        onConfirm={handleDelete}
      />
    </>
  );
}

export function ReportsClient(props: ReportsClientProps) {
  return (
    <ToastProvider>
      <ReportsClientInner {...props} />
    </ToastProvider>
  );
}
