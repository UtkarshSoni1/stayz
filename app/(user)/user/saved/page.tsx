import { AppNavBar } from "@/components/navbar/AppNavBar";
import { requireUser } from "@/lib/auth-helpers";
import { getSavedListings } from "@/lib/saved-service";
import { SavedListingsClient } from "@/components/saved-listings/saved-listings-client";

export const metadata = {
  title: "Saved Listings | StayZ",
  description: "Your saved and bookmarked listings on StayZ.",
};

export default async function SavedListingsPage() {
  // Auth guard — redirects to /login if not authenticated
  const user = await requireUser();

  // SSR initial data — first page, default sort
  const { items, total, hasMore } = await getSavedListings(user.id, {
    sort: "NEWEST",
    page: 1,
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AppNavBar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SavedListingsClient
          initialItems={items}
          initialTotal={total}
          initialHasMore={hasMore}
        />
      </main>
    </div>
  );
}
