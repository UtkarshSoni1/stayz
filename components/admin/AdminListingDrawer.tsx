"use client";

import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  User as UserIcon,
  Home,
  CheckCircle,
  AlertTriangle,
  Building,
  Star,
  Activity,
  Phone,
  Check,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types/listing";

interface AdminListingDrawerProps {
  id: string | null;
  open: boolean;
  onClose: () => void;
}

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  descriptionExtended: string | null;
  propertyType: string;
  city: string;
  locality: string;
  address: string | null;
  pincode: string | null;
  monthlyRent: number;
  deposit: number | null;
  pricePerNight: number | null;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  roomType: string;
  furnishing: string;
  genderPreference: string;
  status: string;
  isAvailable: boolean;
  mapImageUrl: string | null;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  images: { id: string; url: string }[];
  amenities: { amenity: { name: string; icon: string | null } }[];
  highlights: { id: string; title: string; description: string; icon: string }[];
  sleepingArrangements: { id: string; name: string; description: string; icon: string }[];
  thingsToKnow: { id: string; title: string; content: string; icon: string }[];
  owner: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    phone: string | null;
    whatsappNumber: string | null;
    isSuperhost: boolean;
    responseRate: string | null;
    responseTimeLabel: string | null;
  };
  bookingRequestsByStatus: {
    PENDING: number;
    ACCEPTED: number;
    REJECTED: number;
  };
}

export function AdminListingDrawer({ id, open, onClose }: AdminListingDrawerProps) {
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !open) {
      setListing(null);
      return;
    }

    async function fetchDetails() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/listings/${id}`);
        const json = (await res.json()) as ApiSuccessResponse<ListingDetail> | ApiErrorResponse;
        if (!res.ok || !json.success) {
          setError((json as ApiErrorResponse).error ?? "Failed to fetch details");
        } else {
          setListing((json as ApiSuccessResponse<ListingDetail>).data);
        }
      } catch {
        setError("Network error fetching details.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetails();
  }, [id, open]);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        className="w-full sm:max-w-lg bg-stayz-surface-base text-white border-l border-stayz-border-subtle p-0 flex flex-col h-full focus:outline-none"
        side="right"
      >
        <SheetHeader className="p-6 border-b border-stayz-border-subtle flex flex-row items-center justify-between">
          <SheetTitle className="text-lg font-bold text-white">Listing Inspection</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl bg-white/5" />
              <Skeleton className="h-6 w-3/4 bg-white/5" />
              <Skeleton className="h-4 w-1/2 bg-white/5" />
              <Skeleton className="h-24 w-full bg-white/5" />
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
              {error}
            </div>
          )}

          {listing && !isLoading && (
            <>
              {/* Photo Gallery */}
              {listing.images.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 snap-x">
                  {listing.images.map((img) => (
                    <div key={img.id} className="relative h-44 w-72 shrink-0 overflow-hidden rounded-xl border border-white/[0.06] snap-center">
                      <img
                        src={img.url}
                        alt="Property room"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-44 w-full bg-white/5 rounded-xl flex items-center justify-center border border-dashed border-white/10">
                  <span className="text-xs text-white/30">No images available</span>
                </div>
              )}

              {/* Title and stats summary */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white leading-tight">{listing.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="outline" className="capitalize border-white/[0.08] text-white/60 bg-white/5">
                    {listing.propertyType}
                  </Badge>
                  <Badge variant="outline" className="border-white/[0.08] text-white/60 bg-white/5">
                    {listing.roomType}
                  </Badge>
                  <Badge variant="outline" className="border-white/[0.08] text-white/60 bg-white/5">
                    {listing.furnishing}
                  </Badge>
                </div>
              </div>

              {/* Pricing details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Monthly Rent</p>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">₹{listing.monthlyRent.toLocaleString("en-IN")}/mo</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Deposit</p>
                  <p className="text-lg font-bold text-white/80 mt-0.5">
                    {listing.deposit ? `₹${listing.deposit.toLocaleString("en-IN")}` : "None"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
                {listing.descriptionExtended && (
                  <p className="text-sm text-white/50 leading-relaxed mt-2 border-t border-white/[0.05] pt-2">
                    {listing.descriptionExtended}
                  </p>
                )}
              </div>

              {/* Review summary */}
              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Reviews & Ratings</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md text-xs font-bold">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{listing.avgRating > 0 ? listing.avgRating.toFixed(1) : "N/A"}</span>
                  </div>
                  <span className="text-xs text-white/40">Based on {listing.reviewCount} total review(s)</span>
                </div>
              </div>

              {/* Bookings requests summary */}
              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Booking Status</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-center">
                    <p className="text-xs text-yellow-400/60">Pending</p>
                    <p className="text-lg font-bold text-yellow-400 mt-0.5">{listing.bookingRequestsByStatus.PENDING}</p>
                  </div>
                  <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-center">
                    <p className="text-xs text-emerald-400/60">Accepted</p>
                    <p className="text-lg font-bold text-emerald-400 mt-0.5">{listing.bookingRequestsByStatus.ACCEPTED}</p>
                  </div>
                  <div className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-center">
                    <p className="text-xs text-red-400/60">Rejected</p>
                    <p className="text-lg font-bold text-red-400 mt-0.5">{listing.bookingRequestsByStatus.REJECTED}</p>
                  </div>
                </div>
              </div>

              {/* Host / Owner Info */}
              <div className="p-4 rounded-xl border border-stayz-border-subtle bg-stayz-surface-hover">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Property Owner</h4>
                <div className="flex items-center gap-3">
                  {listing.owner.image ? (
                    <img
                      src={listing.owner.image}
                      alt={listing.owner.name ?? "Owner"}
                      className="h-10 w-10 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                      {(listing.owner.name?.[0] ?? listing.owner.email?.[0] ?? "U").toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white truncate">{listing.owner.name ?? "Unnamed"}</p>
                      {listing.owner.isSuperhost && (
                        <span className="inline-flex items-center rounded-sm bg-primary/10 border border-primary/20 px-1 py-0.2 text-[9px] font-bold text-primary uppercase">
                          Superhost
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 truncate">{listing.owner.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-white/[0.06] text-xs">
                  <div>
                    <span className="text-white/40 block">Response Rate</span>
                    <span className="font-semibold text-white mt-0.5 block">{listing.owner.responseRate ?? "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Response Speed</span>
                    <span className="font-semibold text-white mt-0.5 block">{listing.owner.responseTimeLabel ?? "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {listing.amenities.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.amenities.map(({ amenity }) => (
                      <span key={amenity.name} className="inline-flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs text-white/70">
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location map */}
              {listing.mapImageUrl && (
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Property Location</h4>
                  <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {listing.locality}, {listing.city} {listing.pincode}
                  </p>
                  <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                    <img
                      src={listing.mapImageUrl}
                      alt="Map view"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Activity timestamps */}
              <div className="pt-4 border-t border-white/[0.08] text-xs text-white/40 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3" />
                  <span>Activity timestamps</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pl-4">
                  <div>
                    <span>Created: </span>
                    <span className="text-white/60">
                      {new Date(listing.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div>
                    <span>Updated: </span>
                    <span className="text-white/60">
                      {new Date(listing.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
