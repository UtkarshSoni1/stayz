"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import type { UserProfileData } from "@/data/user-profile";
import { ReviewsList } from "./ReviewsList";
import { EditProfileModal } from "./EditProfileModal";

interface PrivateProfileViewProps {
  profile: UserProfileData;
}

// ── Profile Listing Card ──────────────────────────────────────────────────────
function ProfileListingCard({
  listing,
  badgeText,
}: {
  listing: {
    id: string;
    title: string;
    city: string;
    locality: string;
    rent: number;
    image: string | null;
  };
  badgeText?: string;
}) {
  const fallbackImage =
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200"
    >
      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white/5">
        <img
          src={listing.image ?? fallbackImage}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white truncate group-hover:text-teal-400 transition-colors">
            {listing.title}
          </h4>
          <p className="text-xs text-white/40 mt-1 truncate">
            {listing.locality}, {listing.city}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-bold text-white">
            ₹{listing.rent.toLocaleString("en-IN")}
            <span className="text-white/40 font-normal">/mo</span>
          </span>
          {badgeText && (
            <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 truncate max-w-[120px]">
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Account settings rows ─────────────────────────────────────────────────────

interface SettingsRowProps {
  icon: string;
  label: string;
  description: string;
  disabled?: boolean;
  onClick?: () => void;
}

function SettingsRow({
  icon,
  label,
  description,
  disabled = false,
  onClick,
}: SettingsRowProps) {
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
      <span className="material-symbols-outlined text-xl text-teal-400/80">
        {icon}
      </span>
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
        <span className="material-symbols-outlined text-lg text-white/20">
          chevron_right
        </span>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function PrivateProfileView({ profile }: PrivateProfileViewProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* ── Header Card ──────────────────────────────────────────────────── */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={profile.image ?? ""}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover ring-2 ring-white/10"
            />
            <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
              <span
                className="material-symbols-outlined text-white text-sm"
                style={{
                  fontVariationSettings:
                    '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20',
                }}
              >
                check
              </span>
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>

            {/* Stats row */}
            <div className="flex items-center gap-3 mt-2 text-white/40 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-white/25">calendar_month</span>
                Member since {profile.memberSince}
              </span>
              {profile.rentalsCount > 0 && (
                <>
                  <span className="text-white/15">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-white/25">home</span>
                    {profile.rentalsCount} {profile.rentalsCount === 1 ? "stay" : "stays"}
                  </span>
                </>
              )}
            </div>

            {profile.bio && (
              <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-lg">
                {profile.bio}
              </p>
            )}

            {/* Edit Profile pill */}
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Edit Profile
            </button>
          </div>
        </div>

        {/* ── Verification Chips ───────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 mr-2 self-center">
            Verifications
          </span>

          {profile.emailVerified ? (
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-full text-xs font-bold">
              <span
                className="material-symbols-outlined text-sm"
                style={{
                  fontVariationSettings:
                    '"FILL" 1, "wght" 500, "GRAD" 0, "opsz" 20',
                }}
              >
                verified
              </span>
              Email verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-white/5 text-white/30 px-3 py-1.5 rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-sm">mail</span>
              Email not verified
            </span>
          )}

          {profile.phoneVerified ? (
            <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-full text-xs font-bold">
              <span
                className="material-symbols-outlined text-sm"
                style={{
                  fontVariationSettings:
                    '"FILL" 1, "wght" 500, "GRAD" 0, "opsz" 20',
                }}
              >
                phone_enabled
              </span>
              Phone on file
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-white/5 text-white/30 px-3 py-1.5 rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-sm">
                phone_disabled
              </span>
              No phone
            </span>
          )}
        </div>
      </div>

      {/* ── Reviews You've Written ────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
          Reviews you&apos;ve written
        </h2>
        <ReviewsList reviews={profile.reviews} allowDelete />
      </section>

      {/* ── Saved Listings ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/30">
            Saved Listings
          </h2>
          {profile.savedListings && profile.savedListings.length > 0 && (
            <Link
              href="/user/saved"
              className="text-xs font-bold text-teal-400 hover:underline"
            >
              View All
            </Link>
          )}
        </div>
        {profile.savedListings && profile.savedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.savedListings.slice(0, 4).map((listing) => (
              <ProfileListingCard
                key={listing.id}
                listing={listing}
                badgeText={`Saved ${new Date(listing.savedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}`}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 text-center text-white/40 text-sm">
            No saved listings yet.{" "}
            <Link href="/listings" className="text-teal-400 font-semibold hover:underline">
              Browse Listings
            </Link>
          </div>
        )}
      </section>

      {/* ── Recently Rented Listings ──────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
          Recently Rented Listings
        </h2>
        {profile.rentedListings && profile.rentedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.rentedListings.slice(0, 4).map((listing) => (
              <ProfileListingCard
                key={listing.id}
                listing={listing}
                badgeText={`Rented ${new Date(listing.rentedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}`}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 text-center text-white/40 text-sm">
            No rentals yet. Start booking to see your stays here!
          </div>
        )}
      </section>

      {/* ── Account Settings ──────────────────────────────────────────── */}
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

      {/* ── Edit Profile Modal ────────────────────────────────────────── */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={{
          name: profile.name,
          bio: profile.bio,
          image: profile.image,
        }}
      />
    </div>
  );
}
