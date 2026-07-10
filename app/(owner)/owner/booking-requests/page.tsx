"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppNavBar } from "@/components/navbar/AppNavBar";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  MessageSquare,
  Inbox,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface BookingRequestUser {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
}

interface BookingRequestItem {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  moveInDate: string | null;
  guests: number | null;
  message: string | null;
  createdAt: string;
  respondedAt: string | null;
  user: BookingRequestUser;
}

interface ListingWithRequests {
  listingId: string;
  listingTitle: string;
  coverImage: string | null;
  requests: BookingRequestItem[];
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookingRequestsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<ListingWithRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED">("ALL");

  // ── Fetch all owner listings, then their booking requests ─────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch owner's listings
      const listingsRes = await fetch("/api/listings/my?sort=NEWEST");
      const listingsJson = await listingsRes.json();
      if (!listingsRes.ok || !listingsJson.success) {
        setError("Failed to load listings.");
        return;
      }

      const myListings = listingsJson.data as Array<{
        id: string;
        title: string;
        coverImage: string | null;
      }>;

      // Fetch booking requests for each listing (parallel)
      const results = await Promise.all(
        myListings.map(async (listing) => {
          try {
            const res = await fetch(
              `/api/listings/${listing.id}/booking-requests`
            );
            if (!res.ok) return null;
            const json = await res.json();
            if (!json.success) return null;
            return {
              listingId: listing.id,
              listingTitle: listing.title,
              coverImage: listing.coverImage,
              requests: json.data as BookingRequestItem[],
            };
          } catch {
            return null;
          }
        })
      );

      // Filter out null results and listings with no requests
      const withRequests = results.filter(
        (r): r is ListingWithRequests => r !== null && r.requests.length > 0
      );

      setListings(withRequests);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Handle accept/reject ──────────────────────────────────────────────────
  async function handleRespond(requestId: string, status: "ACCEPTED" | "REJECTED") {
    // Optimistic update
    setListings((prev) =>
      prev.map((listing) => ({
        ...listing,
        requests: listing.requests.map((req) =>
          req.id === requestId
            ? { ...req, status, respondedAt: new Date().toISOString() }
            : req
        ),
      }))
    );

    try {
      const res = await fetch(`/api/booking-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        // Revert on failure
        fetchData();
      }
    } catch {
      fetchData();
    }
  }

  // ── Filtered counts ───────────────────────────────────────────────────────
  const allRequests = listings.flatMap((l) => l.requests);
  const pendingCount = allRequests.filter((r) => r.status === "PENDING").length;
  const acceptedCount = allRequests.filter((r) => r.status === "ACCEPTED").length;
  const rejectedCount = allRequests.filter((r) => r.status === "REJECTED").length;

  const filteredListings = listings
    .map((l) => ({
      ...l,
      requests:
        filter === "ALL"
          ? l.requests
          : l.requests.filter((r) => r.status === filter),
    }))
    .filter((l) => l.requests.length > 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground">
      <AppNavBar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Booking Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and respond to guest booking requests across all your
            listings.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total",
              value: allRequests.length,
              active: filter === "ALL",
              onClick: () => setFilter("ALL"),
              icon: Inbox,
              color: "text-white",
            },
            {
              label: "Pending",
              value: pendingCount,
              active: filter === "PENDING",
              onClick: () => setFilter("PENDING"),
              icon: Clock,
              color: "text-amber-400",
            },
            {
              label: "Accepted",
              value: acceptedCount,
              active: filter === "ACCEPTED",
              onClick: () => setFilter("ACCEPTED"),
              icon: CheckCircle,
              color: "text-green-400",
            },
            {
              label: "Rejected",
              value: rejectedCount,
              active: filter === "REJECTED",
              onClick: () => setFilter("REJECTED"),
              icon: XCircle,
              color: "text-red-400",
            },
          ].map((stat) => (
            <button
              key={stat.label}
              onClick={stat.onClick}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                stat.active
                  ? "border-primary/40 bg-primary/5"
                  : "border-white/[0.07] bg-[#111]/60 hover:border-white/[0.14]"
              }`}
            >
              <stat.icon className={`w-5 h-5 shrink-0 ${stat.color}`} />
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-[#111] border border-white/[0.07] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredListings.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Inbox className="w-12 h-12 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">
              {filter === "ALL"
                ? "No booking requests yet. Share your listings to start receiving requests!"
                : `No ${filter.toLowerCase()} requests.`}
            </p>
          </div>
        )}

        {/* Request cards grouped by listing */}
        {!loading &&
          filteredListings.map((listing) => (
            <div
              key={listing.listingId}
              className="rounded-2xl border border-white/[0.07] bg-[#111]/80 overflow-hidden"
            >
              {/* Listing header */}
              <div className="flex items-center gap-3 p-4 border-b border-white/[0.06] bg-[#0d0d0d]">
                {listing.coverImage && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                    <Image
                      src={listing.coverImage}
                      alt={listing.listingTitle}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/listings/${listing.listingId}`}
                    className="text-sm font-semibold text-foreground truncate block hover:text-primary transition-colors"
                  >
                    {listing.listingTitle}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {listing.requests.length} request
                    {listing.requests.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Individual requests */}
              <div className="divide-y divide-white/[0.05]">
                {listing.requests.map((req) => (
                  <div key={req.id} className="flex items-start gap-4 p-4">
                    {/* User avatar */}
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-zinc-800">
                      {req.user.image ? (
                        <Image
                          src={req.user.image}
                          alt={req.user.name ?? "Guest"}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted-foreground bg-zinc-700">
                          {(req.user.name ?? "?")[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Request details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                          {req.user.name ?? req.user.email ?? "Guest"}
                        </span>
                        <StatusBadge status={req.status} />
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                        {req.moveInDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(req.moveInDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        )}
                        {req.guests && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {req.guests} guest{req.guests !== 1 ? "s" : ""}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(req.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>

                      {req.message && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-on-surface-variant/80">
                          <MessageSquare className="w-3 h-3 shrink-0 mt-0.5" />
                          <p className="line-clamp-2">{req.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Action buttons — only for PENDING */}
                    {req.status === "PENDING" && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRespond(req.id, "ACCEPTED")}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
                          aria-label="Accept request"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespond(req.id, "REJECTED")}
                          className="flex items-center justify-center w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                          aria-label="Reject request"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "PENDING" | "ACCEPTED" | "REJECTED" }) {
  const config = {
    PENDING: {
      label: "Pending",
      className: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    },
    ACCEPTED: {
      label: "Accepted",
      className: "bg-green-500/10 border-green-500/20 text-green-400",
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-500/10 border-red-500/20 text-red-400",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}
