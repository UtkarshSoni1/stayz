"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { OwnerProfileData } from "@/data/owner-profile";
import { EditProfileModal } from "@/components/owner/EditProfileModal";

interface PrivateOwnerProfileViewProps {
  profile: OwnerProfileData;
}

// ── Shared HostStat ───────────────────────────────────────────────────────────
function HostStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 text-center">
      <span className="text-lg font-semibold text-white">{value}</span>
      <span className="text-sm text-white/70">{label}</span>
    </div>
  );
}

// ── Status badge for listing cards ────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    ACTIVE:  { label: "Active",  className: "bg-green-500/10 border-green-500/20 text-green-400" },
    RENTED:  { label: "Rented",  className: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
    DRAFT:   { label: "Draft",   className: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400" },
    PENDING: { label: "Pending", className: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
  };
  const c = config[status] ?? { label: status, className: "bg-white/5 border-white/10 text-white/40" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${c.className}`}>
      {c.label}
    </span>
  );
}

// ── Settings row ──────────────────────────────────────────────────────────────
function SettingsRow({
  icon,
  label,
  description,
  disabled = false,
  onClick,
}: {
  icon: string;
  label: string;
  description: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-white/5 active:scale-[0.99]"
      }`}
    >
      <span className="material-symbols-outlined text-xl text-teal-400/80">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">{label}</p>
        <p className="text-white/40 text-xs mt-0.5">{description}</p>
      </div>
      {disabled && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 bg-white/5 px-2.5 py-1 rounded-full">
          Soon
        </span>
      )}
      {!disabled && (
        <span className="material-symbols-outlined text-lg text-white/20">chevron_right</span>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function PrivateOwnerProfileView({ profile }: PrivateOwnerProfileViewProps) {
  const [editOpen, setEditOpen] = useState(false);

  const FALLBACK =
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80";

  // The owner EditProfileModal expects this shape
  const modalUser = {
    id: profile.id,
    name: profile.name,
    email: null, // not fetched — modal has email as read-only from DB anyway
    image: profile.image,
    phone: profile.phone ?? null,
    whatsappNumber: profile.whatsappNumber ?? null,
  };

  return (
    <div className="space-y-10">
      {/* ── Header Card ──────────────────────────────────────────────────── */}
      <div className="glass-card rounded-3xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left — avatar + stats */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.07] p-6 flex gap-6">
              <div className="flex flex-col items-center shrink-0">
                <div className="relative mb-3">
                  <img
                    src={profile.image ?? ""}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                    <span
                      className="material-symbols-outlined text-white text-sm"
                      style={{ fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20' }}
                    >
                      check
                    </span>
                  </span>
                </div>
                <p className="text-xl font-semibold text-white mb-1 text-center">
                  {profile.name}
                </p>
                {profile.isSuperhost && (
                  <span className="inline-flex items-center gap-1.5 text-white/90 font-semibold text-sm">
                    <span className="material-symbols-outlined text-base text-primary">
                      emoji_events
                    </span>
                    Superhost
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col divide-y divide-white/10">
                <HostStat value={String(profile.overallReviewCount)} label="Reviews" />
                <HostStat
                  value={profile.overallRating > 0 ? `${profile.overallRating.toFixed(1)} ★` : "—"}
                  label="Rating"
                />
                <HostStat
                  value={String(profile.yearsHosting)}
                  label={profile.yearsHosting === 1 ? "Year hosting" : "Years hosting"}
                />
              </div>
            </div>

            {/* Personal details */}
            {profile.personalDetails.length > 0 && (
              <ul className="space-y-4">
                {profile.personalDetails.map((d) => (
                  <li key={d.text} className="flex items-center gap-3 text-white/70">
                    <span className="material-symbols-outlined text-xl text-white/50">
                      {d.icon}
                    </span>
                    <span>{d.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right — bio, contact info, response details, edit button */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              </div>
              <div className="flex items-center gap-3 text-white/40 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-white/25">calendar_month</span>
                  Member since {profile.joinedYear}
                </span>
              </div>
            </div>

            {profile.bio && (
              <p className="text-white/60 text-sm leading-relaxed">{profile.bio}</p>
            )}

            {/* Host details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">
                Host details
              </h4>
              <ul className="space-y-1.5 text-sm text-white/60">
                <li>Response rate: {profile.responseRate}</li>
                <li>Responds {profile.responseTime}</li>
              </ul>
            </div>

            {/* Contact info — visible to owner only */}
            {(profile.phone || profile.whatsappNumber) && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">
                  Contact info
                </h4>
                <ul className="space-y-1.5 text-sm text-white/60">
                  {profile.phone && (
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-white/25">phone</span>
                      {profile.phone}
                    </li>
                  )}
                  {profile.whatsappNumber && (
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-white/25">chat</span>
                      {profile.whatsappNumber} (WhatsApp)
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Edit Profile pill */}
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="self-start mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── Listings — all statuses ───────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/30">
            Your Listings
          </h2>
          <Link
            href="/owner/my-listings"
            className="text-xs font-bold text-teal-400 hover:underline"
          >
            Manage All
          </Link>
        </div>

        {profile.listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.listings.map((listing) => (
              <div
                key={listing.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="relative h-40 bg-white/5 overflow-hidden">
                  <img
                    src={listing.image ?? FALLBACK}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={listing.status} />
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {listing.title}
                  </h3>
                  <p className="text-xs text-white/40 mt-1 truncate">
                    {listing.locality}, {listing.city}
                  </p>
                  <p className="text-xs font-bold text-white mt-2">
                    ₹{listing.rent.toLocaleString("en-IN")}
                    <span className="text-white/40 font-normal">/mo</span>
                  </p>
                </div>
                <div className="flex border-t border-white/[0.06]">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="flex-1 py-2.5 text-center text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/owner/my-listings`}
                    className="flex-1 py-2.5 text-center text-xs font-semibold text-teal-400/70 hover:text-teal-400 hover:bg-teal-500/5 transition-colors border-l border-white/[0.06]"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center text-white/40 text-sm">
            No listings yet.{" "}
            <Link href="/owner/add-listing" className="text-teal-400 font-semibold hover:underline">
              Create your first listing
            </Link>
          </div>
        )}
      </section>

      {/* ── Account Settings ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
          Account Settings
        </h2>
        <div className="glass-card rounded-2xl divide-y divide-white/5">
          <SettingsRow
            icon="notifications"
            label="Notification Preferences"
            description="Manage email and push notifications"
            disabled
          />
          <SettingsRow
            icon="lock"
            label="Privacy"
            description="Control who can see your profile info"
            disabled
          />
          <SettingsRow
            icon="key"
            label="Change Password"
            description="Update your account password"
            disabled
          />
          <SettingsRow
            icon="logout"
            label="Log Out"
            description="Sign out of your account"
            onClick={() => signOut({ callbackUrl: "/" })}
          />
        </div>
      </section>

      {/* ── Edit Profile Modal — reuses owner/EditProfileModal ────────────── */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialUser={modalUser}
      />
    </div>
  );
}
