"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  Search,
  CheckCircle,
  AlertTriangle,
  Home,
  PlusCircle,
  FileEdit,
  KeyRound,
  Trash2,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  XCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdminListingDrawer } from "./AdminListingDrawer";
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types/listing";

// Custom Status Badge inside Admin panel
function AdminStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; className: string; dot: string }> = {
    ACTIVE: {
      label: "Active",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    DRAFT: {
      label: "Draft",
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      dot: "bg-amber-400",
    },
    RENTED: {
      label: "Rented",
      className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      dot: "bg-zinc-400",
    },
    SUSPENDED: {
      label: "Suspended",
      className: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5",
      dot: "bg-rose-400",
    },
  };

  const config = configs[status] || {
    label: status,
    className: "bg-white/5 text-white/60 border-white/10",
    dot: "bg-white/40",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${config.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

interface ListingItem {
  id: string;
  title: string;
  city: string;
  locality: string;
  monthlyRent: number;
  status: string;
  propertyType: string;
  createdAt: string;
  reviewCount: number;
  avgRating: number;
  images: { url: string }[];
  owner: { id: string; name: string | null; email: string | null };
  _count: { bookingRequests: number };
}

interface StatsData {
  total: number;
  active: number;
  draft: number;
  rented: number;
  suspended: number;
}

interface AdminListingsClientProps {
  userEmail: string;
}

export function AdminListingsClient({ userEmail }: AdminListingsClientProps) {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [stats, setStats] = useState<StatsData>({ total: 0, active: 0, draft: 0, rented: 0, suspended: 0 });
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [propertyType, setPropertyType] = useState("ALL");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Selection & Actions State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspectedListingId, setInspectedListingId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals / Action confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  // Fetch listing stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/listings/stats");
      const json = (await res.json()) as ApiSuccessResponse<StatsData> | ApiErrorResponse;
      if (res.ok && json.success) {
        setStats(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  }, []);

  // Fetch main list of items
  const fetchListings = useCallback(
    async (opts: { search: string; status: string; propertyType: string; city: string; page: number }) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (opts.search) params.set("search", opts.search);
        if (opts.status !== "ALL") params.set("status", opts.status);
        if (opts.propertyType !== "ALL") params.set("propertyType", opts.propertyType);
        if (opts.city) params.set("city", opts.city);
        params.set("page", String(opts.page));
        params.set("limit", String(limit));

        const res = await fetch(`/api/admin/listings?${params.toString()}`);
        const json = (await res.json()) as
          | ApiSuccessResponse<{ items: ListingItem[]; total: number }>
          | ApiErrorResponse;

        if (!res.ok || !json.success) {
          setError((json as ApiErrorResponse).error ?? "Failed to load listings.");
          return;
        }

        setListings(json.data.items);
        setTotalCount(json.data.total);
      } catch {
        setError("Network error loading listings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Trigger loading data
  useEffect(() => {
    fetchStats();
    fetchListings({ search, status, propertyType, city, page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, propertyType]);

  // Debounced Search or Type inputs via Transition
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setPage(1);
        fetchListings({ search, status, propertyType, city, page: 1 });
      });
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, city]);

  // Handle single action approval
  async function handleApprove(id: string) {
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      if (res.ok) {
        setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: "ACTIVE" } : l)));
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handle single action suspension
  async function handleSuspend(id: string) {
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SUSPENDED" }),
      });
      if (res.ok) {
        setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status: "SUSPENDED" } : l)));
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handle single item deletion
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setListings((prev) => prev.filter((l) => l.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        setDeleteConfirmId(null);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handle bulk updates
  async function handleBulkAction(action: "ACTIVATE" | "SUSPEND" | "DELETE") {
    if (selectedIds.length === 0) return;
    try {
      if (action === "DELETE") {
        setIsBulkDeleteConfirmOpen(true);
        return;
      }

      const res = await fetch("/api/admin/listings/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      });

      if (res.ok) {
        const newStatus = action === "SUSPEND" ? "SUSPENDED" : "ACTIVE";
        setListings((prev) =>
          prev.map((l) => (selectedIds.includes(l.id) ? { ...l, status: newStatus } : l))
        );
        setSelectedIds([]);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Handle bulk delete confirm
  async function executeBulkDelete() {
    try {
      const res = await fetch("/api/admin/listings/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action: "DELETE" }),
      });

      if (res.ok) {
        setListings((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
        setSelectedIds([]);
        setIsBulkDeleteConfirmOpen(false);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Multi-select actions helper
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(listings.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AdminPageHeader
          icon={Home}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-400"
          title="Manage Listings"
          description="Review, approve, suspend, or delete room listings across StayZ."
          breadcrumbs={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Listings" },
          ]}
          action={
            <div className="flex items-center gap-2">
              {/* Tooltip wrapper for coming soon placeholders */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-white/10 bg-white/5 text-xs text-white/40 cursor-not-allowed select-none">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Reports</span>
                      <Badge className="bg-white/5 text-white/30 text-[9px] scale-90 ml-1 py-0 px-1 border-white/5">Soon</Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border border-white/10 text-white text-xs">
                    Moderator report tracking coming soon.
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-white/10 bg-white/5 text-xs text-white/40 cursor-not-allowed select-none">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Quality Score</span>
                      <Badge className="bg-white/5 text-white/30 text-[9px] scale-90 ml-1 py-0 px-1 border-white/5">Soon</Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border border-white/10 text-white text-xs">
                    Automated property listing quality metrics coming soon.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          }
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {[
            { label: "Total Listings", val: stats.total, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { label: "Active Listings", val: stats.active, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            { label: "Draft Listings", val: stats.draft, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
            { label: "Rented Out", val: stats.rented, color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
            { label: "Suspended", val: stats.suspended, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
          ].map((card, i) => (
            <div key={i} className={`relative overflow-hidden rounded-xl border ${card.border} bg-[#111]/80 p-4 backdrop-blur-sm shadow-md`}>
              <p className="text-xs text-white/40 font-semibold">{card.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-white">{card.val}</p>
              <div className={`absolute top-2 right-2 rounded-lg p-1.5 ${card.bg}`}>
                <Home className={`h-3.5 w-3.5 ${card.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-xl border border-white/[0.07] bg-[#111]/60 p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
            <Input
              type="text"
              placeholder="Search title, owner name or email..."
              className="pl-9 bg-black/40 border-white/10 text-white placeholder-white/30 focus-visible:ring-white/20 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Status Selector */}
            <Select value={status} onValueChange={(val) => { setPage(1); setStatus(val); }}>
              <SelectTrigger className="w-[130px] bg-black/40 border-white/10 text-white h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="RENTED">Rented</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {/* Room / Property Type Selector */}
            <Select value={propertyType} onValueChange={(val) => { setPage(1); setPropertyType(val); }}>
              <SelectTrigger className="w-[150px] bg-black/40 border-white/10 text-white h-9">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="Entire apartment">Entire Apartment</SelectItem>
                <SelectItem value="Private room">Private Room</SelectItem>
                <SelectItem value="Shared room">Shared Room</SelectItem>
              </SelectContent>
            </Select>

            {/* City Input */}
            <div className="relative w-[140px]">
              <Input
                type="text"
                placeholder="Filter City"
                className="bg-black/40 border-white/10 text-white h-9 text-xs"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {(search || status !== "ALL" || propertyType !== "ALL" || city) && (
              <Button
                variant="ghost"
                className="text-xs text-white/40 hover:text-white h-9 px-2 hover:bg-white/5"
                onClick={() => {
                  setSearch("");
                  setStatus("ALL");
                  setPropertyType("ALL");
                  setCity("");
                  setPage(1);
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Selected Counter & Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
            <span className="text-xs text-white/70 font-semibold">{selectedIds.length} listing(s) selected</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-white/80 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 text-xs h-8"
                onClick={() => handleBulkAction("ACTIVATE")}
              >
                Activate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-white/80 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 text-xs h-8"
                onClick={() => handleBulkAction("SUSPEND")}
              >
                Suspend
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="text-xs h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/35"
                onClick={() => handleBulkAction("DELETE")}
              >
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Listings Display (Table / Stacked Cards) */}
        {isLoading || isPending ? (
          <div className="space-y-4">
            <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-24 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-24 bg-white/5 rounded-lg animate-pulse" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">{error}</div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-white/10 bg-[#111]/20">
            <AlertCircle className="h-10 w-10 text-white/20 mb-3" />
            <p className="text-sm font-semibold text-white/60">No properties found</p>
            <p className="text-xs text-white/30 mt-1">Try resetting search filters or modify search terms.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border border-white/[0.08] bg-[#111]/80 backdrop-blur-sm overflow-hidden">
              <Table>
                <TableHeader className="border-b border-white/[0.08] bg-white/[0.01]">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-white/20 bg-black/40 text-primary focus:ring-offset-0 focus:ring-0 cursor-pointer"
                        checked={selectedIds.length === listings.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableHead>
                    <TableHead>Cover</TableHead>
                    <TableHead className="max-w-[200px]">Property details</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Rent</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-white/[0.05]">
                  {listings.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-white/[0.02] cursor-pointer"
                      onClick={() => {
                        setInspectedListingId(item.id);
                        setIsDrawerOpen(true);
                      }}
                    >
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="rounded border-white/20 bg-black/40 text-primary focus:ring-offset-0 focus:ring-0 cursor-pointer"
                          checked={selectedIds.includes(item.id)}
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-16 rounded overflow-hidden bg-white/5 border border-white/[0.08]">
                          <img
                            src={item.images[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=150&auto=format"}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-white truncate max-w-[220px]">{item.title}</div>
                        <div className="text-[11px] text-white/40 mt-0.5">{item.propertyType}</div>
                      </TableCell>
                      <TableCell className="text-sm text-white/80">{item.city}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-white truncate max-w-[140px]">{item.owner.name || "Unnamed"}</div>
                        <div className="text-[11px] text-white/40 truncate max-w-[140px]">{item.owner.email}</div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-white/90">₹{item.monthlyRent.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-center">
                        <AdminStatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          {item.status === "DRAFT" && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="text-emerald-400 hover:bg-emerald-500/10"
                              title="Approve Listing"
                              onClick={() => handleApprove(item.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {item.status === "ACTIVE" && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="text-rose-400 hover:bg-rose-500/10"
                              title="Suspend Listing"
                              onClick={() => handleSuspend(item.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Link href={`/listings/${item.id}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon-xs" className="text-white/60 hover:bg-white/5" title="View Public Page">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-red-400 hover:bg-red-500/10"
                            title="Delete listing"
                            onClick={() => setDeleteConfirmId(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Stacked Card View */}
            <div className="block md:hidden space-y-3">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/[0.08] bg-[#111]/80 p-4 space-y-3 cursor-pointer"
                  onClick={() => {
                    setInspectedListingId(item.id);
                    setIsDrawerOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="h-12 w-16 shrink-0 rounded overflow-hidden bg-white/5 border border-white/[0.08]">
                        <img
                          src={item.images[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=150&auto=format"}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white text-sm line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-white/40 mt-0.5">{item.propertyType} • {item.city}</p>
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded border-white/20 bg-black/40 text-primary cursor-pointer"
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.05]">
                    <div>
                      <span className="text-white/40 block">Owner</span>
                      <span className="font-medium text-white/80">{item.owner.name || "Unnamed"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white/40 block">Rent</span>
                      <span className="font-bold text-white">₹{item.monthlyRent.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <AdminStatusBadge status={item.status} />
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {item.status === "DRAFT" && (
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-emerald-400 hover:bg-emerald-500/10 text-xs px-2 h-7"
                          onClick={() => handleApprove(item.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {item.status === "ACTIVE" && (
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-rose-400 hover:bg-rose-500/10 text-xs px-2 h-7"
                          onClick={() => handleSuspend(item.id)}
                        >
                          Suspend
                        </Button>
                      )}
                      <Link href={`/listings/${item.id}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon-xs" className="h-7 w-7 text-white/60">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="h-7 w-7 text-red-400 hover:bg-red-500/10"
                        onClick={() => setDeleteConfirmId(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <span className="text-xs text-white/40">
                  Showing page {page} of {totalPages} ({totalCount} listing(s))
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-white/70 h-8 px-2.5 disabled:opacity-30"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 text-xs ${
                          pageNum === page ? "bg-white text-black" : "border-white/10 text-white/70"
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-white/70 h-8 px-2.5 disabled:opacity-30"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Side Inspections Slider Panel */}
      <AdminListingDrawer id={inspectedListingId} open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Single Listing Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="bg-[#0d0d0d] border border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Listing?</DialogTitle>
            <DialogDescription className="text-white/40">
              Are you sure you want to permanently delete this listing? This action is irreversible and will delete all associated photos and reviews.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-white/10 text-white" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Modal */}
      <Dialog open={isBulkDeleteConfirmOpen} onOpenChange={setIsBulkDeleteConfirmOpen}>
        <DialogContent className="bg-[#0d0d0d] border border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Multiple Listings?</DialogTitle>
            <DialogDescription className="text-white/40">
              Are you sure you want to permanently delete the {selectedIds.length} selected listing(s)? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-white/10 text-white" onClick={() => setIsBulkDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={executeBulkDelete}>
              Delete All Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
