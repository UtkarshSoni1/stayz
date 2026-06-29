import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MinimalNavBar } from "@/components/navbar/MinimalNavBar";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  ArrowLeft,
  Home,
  MapPin,
  Phone,
  User,
  BedDouble,
  IndianRupee,
  Sparkles,
  FileText,
  CheckCircle2,
  XCircle,
  Wifi,
  Wind,
  Car,
  ShowerHead,
  ChefHat,
  Trees,
  Zap,
  Refrigerator,
  Flame,
  Camera,
  Building2,
  Droplets,
  Calendar,
} from "lucide-react";
import {
  ROOM_TYPE_LABELS,
  ROOM_TYPE_COLORS,
  FURNISHING_LABELS,
  FURNISHING_COLORS,
  GENDER_LABELS,
  GENDER_COLORS,
  formatRent,
} from "@/components/listings/listingConfig";

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { title: true, city: true, locality: true },
  });
  if (!listing) return { title: "Listing Not Found | StayZ" };
  return {
    title: `${listing.title} — ${listing.locality}, ${listing.city} | StayZ`,
    description: `View details for this listing in ${listing.locality}, ${listing.city}.`,
  };
}

// ── Amenity icon map ──────────────────────────────────────────────────────────
const AMENITY_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  WIFI:         { icon: Wifi,        color: "text-sky-400",    bg: "bg-sky-500/10",     label: "WiFi" },
  AC:           { icon: Wind,        color: "text-cyan-400",   bg: "bg-cyan-500/10",    label: "AC" },
  PARKING:      { icon: Car,         color: "text-yellow-400", bg: "bg-yellow-500/10",  label: "Parking" },
  LAUNDRY:      { icon: ShowerHead,  color: "text-blue-400",   bg: "bg-blue-500/10",    label: "Laundry" },
  KITCHEN:      { icon: ChefHat,     color: "text-orange-400", bg: "bg-orange-500/10",  label: "Kitchen" },
  BALCONY:      { icon: Trees,       color: "text-green-400",  bg: "bg-green-500/10",   label: "Balcony" },
  POWER_BACKUP: { icon: Zap,         color: "text-amber-400",  bg: "bg-amber-500/10",   label: "Power Backup" },
  REFRIGERATOR: { icon: Refrigerator,color: "text-indigo-400", bg: "bg-indigo-500/10",  label: "Refrigerator" },
  GEYSER:       { icon: Flame,       color: "text-red-400",    bg: "bg-red-500/10",     label: "Geyser" },
  CCTV:         { icon: Camera,      color: "text-slate-400",  bg: "bg-slate-500/10",   label: "CCTV" },
  LIFT:         { icon: Building2,   color: "text-purple-400", bg: "bg-purple-500/10",  label: "Lift" },
  RO_WATER:     { icon: Droplets,    color: "text-teal-400",   bg: "bg-teal-500/10",    label: "RO Water" },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${colorClass}`}>
      {label}
    </span>
  );
}

function SectionCard({ icon, title, accentColor, children }: {
  icon: React.ReactNode;
  title: string;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className={`flex items-center gap-3 border-b px-5 py-4 ${accentColor}`}>
        {icon}
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/40 last:border-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0 w-32">{label}</span>
      <span className="text-sm text-foreground text-right">{value}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [listing, session] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        amenities: { include: { amenity: true } },
        owner: { select: { id: true, name: true, image: true } },
      },
    }),
    auth(),
  ]);

  if (!listing) notFound();

  const isOwner = session?.user?.id === listing.ownerId;
  const primaryImage = listing.images[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MinimalNavBar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* ── LEFT COLUMN ───────────────────────────────────────────────────── */}
          <div className="space-y-6 min-w-0">

            {/* ── Image Gallery ──────────────────────────────────────────────── */}
            <div className="overflow-hidden rounded-2xl border bg-muted/20">
              {primaryImage ? (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={primaryImage.url}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-muted/30">
                  <Home className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
                </div>
              )}
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-1 p-1">
                  {listing.images.slice(1, 5).map((img) => (
                    <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image src={img.url} alt={listing.title} fill sizes="25vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Title + location ───────────────────────────────────────────── */}
            <div>
              <div className="flex items-start gap-3 justify-between flex-wrap">
                <h1 className="text-2xl font-bold leading-snug text-foreground sm:text-3xl">
                  {listing.title}
                </h1>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${listing.isAvailable ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                  {listing.isAvailable ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                  {listing.isAvailable ? "Available" : "Not Available"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="text-sm">
                  {listing.locality}, {listing.city}
                  {listing.pincode ? ` – ${listing.pincode}` : ""}
                </span>
              </div>
              {listing.address && (
                <p className="mt-1 text-sm text-muted-foreground pl-5">{listing.address}</p>
              )}
            </div>

            {/* ── Quick badges ───────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2">
              <Badge label={ROOM_TYPE_LABELS[listing.roomType]} colorClass={ROOM_TYPE_COLORS[listing.roomType]} />
              <Badge label={FURNISHING_LABELS[listing.furnishing]} colorClass={FURNISHING_COLORS[listing.furnishing]} />
              <Badge label={`${GENDER_LABELS[listing.genderPreference]} only`} colorClass={GENDER_COLORS[listing.genderPreference]} />
            </div>

            {/* ── Property Details ───────────────────────────────────────────── */}
            <SectionCard
              icon={<FileText className="h-4 w-4 text-primary" />}
              title="Property Details"
              accentColor="bg-primary/5"
            >
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {listing.description}
              </p>
            </SectionCard>

            {/* ── Location Details ───────────────────────────────────────────── */}
            <SectionCard
              icon={<MapPin className="h-4 w-4 text-blue-400" />}
              title="Location"
              accentColor="bg-blue-500/5"
            >
              <DetailRow label="City" value={listing.city} />
              <DetailRow label="Locality" value={listing.locality} />
              {listing.address && <DetailRow label="Address" value={listing.address} />}
              {listing.pincode && <DetailRow label="Pincode" value={listing.pincode} />}
            </SectionCard>

            {/* ── Room Details ───────────────────────────────────────────────── */}
            <SectionCard
              icon={<BedDouble className="h-4 w-4 text-violet-400" />}
              title="Room Details"
              accentColor="bg-violet-500/5"
            >
              <DetailRow label="Room Type" value={
                <Badge label={ROOM_TYPE_LABELS[listing.roomType]} colorClass={ROOM_TYPE_COLORS[listing.roomType]} />
              } />
              <DetailRow label="Furnishing" value={
                <Badge label={FURNISHING_LABELS[listing.furnishing]} colorClass={FURNISHING_COLORS[listing.furnishing]} />
              } />
              <DetailRow label="Gender" value={
                <Badge label={`${GENDER_LABELS[listing.genderPreference]} only`} colorClass={GENDER_COLORS[listing.genderPreference]} />
              } />
              <DetailRow label="Status" value={
                <span className={`font-medium ${listing.isAvailable ? "text-green-500" : "text-red-500"}`}>
                  {listing.isAvailable ? "Available" : "Not Available"}
                </span>
              } />
            </SectionCard>

            {/* ── Pricing Details ────────────────────────────────────────────── */}
            <SectionCard
              icon={<IndianRupee className="h-4 w-4 text-emerald-400" />}
              title="Pricing"
              accentColor="bg-emerald-500/5"
            >
              <DetailRow
                label="Monthly Rent"
                value={<span className="text-base font-bold text-emerald-400">{formatRent(listing.monthlyRent)}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>}
              />
              <DetailRow
                label="Security Deposit"
                value={listing.deposit ? <span className="font-medium">{formatRent(listing.deposit)}</span> : <span className="text-muted-foreground/50">Not specified</span>}
              />
            </SectionCard>

            {/* ── Amenities ──────────────────────────────────────────────────── */}
            {listing.amenities.length > 0 && (
              <SectionCard
                icon={<Sparkles className="h-4 w-4 text-amber-400" />}
                title={`Amenities (${listing.amenities.length})`}
                accentColor="bg-amber-500/5"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {listing.amenities.map(({ amenity }) => {
                    const config = AMENITY_ICONS[amenity.name];
                    const Icon = config?.icon;
                    return (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-2.5 rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5"
                      >
                        {Icon && (
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                            <Icon className={`h-4 w-4 ${config.color}`} />
                          </div>
                        )}
                        <span className="text-sm font-medium text-foreground">
                          {config?.label ?? amenity.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            {/* ── Listed on ──────────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Listed on {new Date(listing.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>

          {/* ── RIGHT COLUMN (sticky) ─────────────────────────────────────────── */}
          <div>
            <div className="sticky top-20 space-y-4">

              {/* Pricing card */}
              <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {formatRent(listing.monthlyRent)}
                    <span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                  {listing.deposit && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      + {formatRent(listing.deposit)} deposit
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Room Type</span>
                    <span className="font-medium">{ROOM_TYPE_LABELS[listing.roomType]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Furnishing</span>
                    <span className="font-medium">{FURNISHING_LABELS[listing.furnishing]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Preferred</span>
                    <span className="font-medium">{GENDER_LABELS[listing.genderPreference]} only</span>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Owner */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Listed by
                  </p>
                  <div className="flex items-center gap-3">
                    {listing.owner.image ? (
                      <Image
                        src={listing.owner.image}
                        alt={listing.owner.name ?? "Owner"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover ring-2 ring-border"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted ring-2 ring-border">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {listing.owner.name ?? "Anonymous"}
                    </span>
                  </div>
                </div>

                <hr className="border-border" />

                {/* CTA */}
                {session?.user ? (
                  <button
                    id="contact-owner-btn"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95"
                  >
                    <Phone className="h-4 w-4" />
                    Contact Owner
                  </button>
                ) : (
                  <Link
                    href="/login"
                    id="login-to-contact-btn"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95"
                  >
                    Login to Contact
                  </Link>
                )}

                {isOwner && (
                  <Link
                    href="/dashboard"
                    id="manage-listing-btn"
                    className="flex w-full items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/40"
                  >
                    Manage in Dashboard
                  </Link>
                )}
              </div>

              {/* Location summary card */}
              <div className="rounded-2xl border bg-card p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5" />
                  Location
                </div>
                <p className="text-sm font-medium text-foreground">{listing.locality}</p>
                <p className="text-sm text-muted-foreground">{listing.city}{listing.pincode ? ` – ${listing.pincode}` : ""}</p>
                {listing.address && (
                  <p className="text-xs text-muted-foreground/70 pt-1 border-t border-border/40">{listing.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
