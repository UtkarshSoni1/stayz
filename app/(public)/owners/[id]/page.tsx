import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { auth } from "@/lib/auth";
import { getOwnerProfile } from "@/data/owner-profile";
import { PrivateOwnerProfileView } from "@/components/owner-profile/PrivateOwnerProfileView";
import { PublicOwnerProfileView } from "@/components/owner-profile/PublicOwnerProfileView";

// ── Dynamic metadata ──────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getOwnerProfile(id);

  if (!profile) {
    return { title: "Owner Not Found — StayZ" };
  }

  return {
    title: `${profile.name} — Owner Profile | StayZ`,
    description: `View ${profile.name}'s listings and host profile on StayZ. ${profile.isSuperhost ? "Superhost." : ""} Member since ${profile.joinedYear}.`,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function OwnerProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  const profile = await getOwnerProfile(id, session?.user?.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ── Minimal top bar ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
                href={`/owners/${session.user.id}`}
                className="text-white/40 hover:text-white transition-colors"
              >
                Profile
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {profile.isOwnProfile ? (
          <PrivateOwnerProfileView profile={profile} />
        ) : (
          <PublicOwnerProfileView profile={profile} />
        )}
      </main>
    </div>
  );
}
