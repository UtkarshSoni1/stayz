import type { OwnerProfileData } from "@/data/owner-profile";
import Link from "next/link";

interface PublicOwnerProfileViewProps {
  profile: Pick<
    OwnerProfileData,
    | "name"
    | "image"
    | "bio"
    | "joinedYear"
    | "isSuperhost"
    | "responseRate"
    | "responseTime"
    | "yearsHosting"
    | "overallRating"
    | "overallReviewCount"
    | "personalDetails"
    | "listings"
  >;
}

// ── Shared HostStat (mirrors the one in HostCard.tsx) ─────────────────────────
function HostStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 text-center">
      <span className="text-lg font-semibold text-white">{value}</span>
      <span className="text-sm text-white/70">{label}</span>
    </div>
  );
}

/**
 * Read-only public view of an owner's profile.
 * Only shows ACTIVE listings; no contact info or edit affordances.
 */
export function PublicOwnerProfileView({ profile }: PublicOwnerProfileViewProps) {
  const FALLBACK =
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="space-y-10">
      {/* ── Header Card ──────────────────────────────────────────────────── */}
      <div className="glass-card rounded-3xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left — avatar, name, stats */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/[0.03] rounded-2xl border border-white/[0.07] p-6 flex gap-6">
              <div className="flex flex-col items-center shrink-0">
                <div className="relative mb-3">
                  <img
                    src={profile.image ?? ""}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-7 h-7 bg-[#ff385c] rounded-full flex items-center justify-center border-2 border-[#111]">
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

          {/* Right — bio, response details */}
          <div className="flex flex-col gap-6">
            {profile.isSuperhost && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {profile.name} is a Superhost
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Superhosts are experienced, highly rated hosts who are committed to
                  providing great stays for guests.
                </p>
              </div>
            )}

            {profile.bio && (
              <p className="text-white/60 text-sm leading-relaxed">{profile.bio}</p>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">
                Host details
              </h4>
              <ul className="space-y-1.5 text-sm text-white/60">
                <li>Member since {profile.joinedYear}</li>
                <li>Response rate: {profile.responseRate}</li>
                <li>Responds {profile.responseTime}</li>
              </ul>
            </div>

            <p className="text-xs text-white/30 leading-relaxed flex items-start gap-2">
              <span className="material-symbols-outlined text-white/25 text-lg shrink-0 mt-0.5">shield</span>
              To protect your payment, always use StayZ to send money and communicate
              with hosts.
            </p>
          </div>
        </div>
      </div>

      {/* ── Active Listings ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
          Listings by {profile.name}
        </h2>
        {profile.listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200"
              >
                <div className="relative h-40 bg-white/5 overflow-hidden">
                  <img
                    src={listing.image ?? FALLBACK}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-teal-400 transition-colors">
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 text-center text-white/40 text-sm">
            No active listings at the moment.
          </div>
        )}
      </section>
    </div>
  );
}
