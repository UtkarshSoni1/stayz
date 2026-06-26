"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { RoomType, GenderPreference } from "@prisma/client";

const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "SINGLE", label: "Single" },
  { value: "SHARED", label: "Shared" },
  { value: "PG", label: "PG" },
  { value: "FLAT", label: "Flat" },
];

const GENDER_PREFS: { value: GenderPreference; label: string }[] = [
  { value: "ANY", label: "Any" },
  { value: "MALE", label: "Boys" },
  { value: "FEMALE", label: "Girls" },
];

export default function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCity = searchParams.get("city") ?? "";
  const activeRoomType = searchParams.get("roomType") ?? "";
  const activeGender = searchParams.get("genderPreference") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/listings?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const togglePill = useCallback(
    (key: string, value: string, current: string) => {
      updateParam(key, current === value ? "" : value);
    },
    [updateParam]
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-3">
      {/* City input */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="city-filter"
          className="shrink-0 text-xs font-medium text-zinc-400 uppercase tracking-widest"
        >
          City
        </label>
        <input
          id="city-filter"
          type="text"
          placeholder="e.g. Gwalior, Pune…"
          defaultValue={activeCity}
          onChange={(e) => updateParam("city", e.target.value)}
          className="w-48 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
        />
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-zinc-800 sm:hidden" />

      {/* Room type pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="shrink-0 text-xs font-medium text-zinc-400 uppercase tracking-widest">
          Type
        </span>
        {ROOM_TYPES.map(({ value, label }) => {
          const active = activeRoomType === value;
          return (
            <button
              key={value}
              id={`filter-roomtype-${value.toLowerCase()}`}
              onClick={() => togglePill("roomType", value, activeRoomType)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "bg-violet-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Gender preference pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="shrink-0 text-xs font-medium text-zinc-400 uppercase tracking-widest">
          For
        </span>
        {GENDER_PREFS.map(({ value, label }) => {
          const active = activeGender === value;
          return (
            <button
              key={value}
              id={`filter-gender-${value.toLowerCase()}`}
              onClick={() =>
                togglePill("genderPreference", value, activeGender)
              }
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "bg-violet-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
