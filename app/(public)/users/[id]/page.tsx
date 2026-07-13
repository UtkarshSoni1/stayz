import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/data/user-profile";
import { PrivateProfileView } from "@/components/user-profile/PrivateProfileView";
import { PublicProfileView } from "@/components/user-profile/PublicProfileView";

// ── Dynamic metadata ─────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getUserProfile(id);

  if (!profile) {
    return { title: "User Not Found — StayZ" };
  }

  return {
    title: `${profile.name} — StayZ`,
    description: `View ${profile.name}'s profile on StayZ. Member since ${profile.memberSince}.`,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const profile = await getUserProfile(id, session?.user?.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ── Minimal top bar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <Home size={18} />
            <span className="font-bold text-sm tracking-tight">StayZ</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/listings"
              className="text-white/40 hover:text-white transition-colors"
            >
              Browse
            </Link>
            {session?.user && (
              <Link
                href={`/users/${session.user.id}`}
                className="text-white/40 hover:text-white transition-colors"
              >
                Profile
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        {profile.isOwnProfile ? (
          <PrivateProfileView profile={profile} />
        ) : (
          <PublicProfileView profile={profile} />
        )}
      </main>
    </div>
  );
}
