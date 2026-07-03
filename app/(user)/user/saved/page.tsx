import { AppNavBar } from "@/components/navbar/AppNavBar";
import { Heart, Search } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Saved Listings | StayZ",
  description: "Your saved and bookmarked listings.",
};

export default function SavedListingsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AppNavBar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Heart className="h-8 w-8 text-rose-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Saved Listings</h1>
        <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
          Your saved properties will appear here. Start browsing to save listings you love.
        </p>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-6 py-3 text-sm font-bold hover:bg-white/90 transition-all"
        >
          <Search className="h-4 w-4" />
          Browse Listings
        </Link>
      </main>
    </div>
  );
}
