import type { UserProfileData } from "@/data/user-profile";
import { ReviewsList } from "./ReviewsList";

interface PublicProfileViewProps {
  profile: Pick<
    UserProfileData,
    "name" | "image" | "bio" | "memberSince" | "emailVerified" | "rentalsCount" | "reviews"
  >;
}

/**
 * Read-only public profile view.
 *
 * By construction this component never receives bio-edit affordances,
 * phone/email/settings, or any private contact info — it only renders
 * what the interface allows: name, avatar, member-since, verified badge,
 * and the user's written reviews.
 */
export function PublicProfileView({ profile }: PublicProfileViewProps) {
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

            {/* Single verified badge if email is verified */}
            {profile.emailVerified && (
              <div className="mt-4">
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
                  Verified
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Reviews Written ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
          Reviews written
        </h2>
        <ReviewsList reviews={profile.reviews} />
      </section>
    </div>
  );
}
