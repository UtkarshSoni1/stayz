"use client";

import { useState, useCallback, useTransition } from "react";
import { useToast } from "@/components/ui/toast";

interface UseSavedListingOptions {
  listingId: string;
  initialSaved?: boolean;
}

interface UseSavedListingReturn {
  saved: boolean;
  loading: boolean;
  toggle: () => Promise<void>;
}

/**
 * Manages the save/unsave state for a single listing card.
 * Performs an optimistic UI update and rolls back on API failure.
 */
export function useSavedListing({
  listingId,
  initialSaved = false,
}: UseSavedListingOptions): UseSavedListingReturn {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const toggle = useCallback(async () => {
    if (isPending) return;

    // Optimistic update
    const prev = saved;
    setSaved(!prev);

    try {
      const res = await fetch("/api/saved/toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        // Handle unauthenticated state gracefully
        if (res.status === 401) {
          setSaved(prev); // rollback
          toast("Sign in to save listings", "info");
          return;
        }
        throw new Error(data.error ?? "Failed to toggle save.");
      }

      const data = (await res.json()) as {
        success: boolean;
        data: { saved: boolean };
      };

      // Sync with server truth
      startTransition(() => {
        setSaved(data.data.saved);
      });

      toast(
        data.data.saved ? "Saved to your wishlist ❤️" : "Removed from saved",
        data.data.saved ? "success" : "info"
      );
    } catch {
      // Rollback on failure
      setSaved(prev);
      toast("Error updating saved listing", "error");
    }
  }, [listingId, saved, isPending, toast]);

  return { saved, loading: isPending, toggle };
}
