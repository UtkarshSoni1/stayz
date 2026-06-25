"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { RoomType, GenderPreference } from "@prisma/client";
import { Search, ChevronDown } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────
const ROOM_TYPE_OPTIONS: { value: RoomType; label: string }[] = [
  { value: "SINGLE", label: "Single" },
  { value: "SHARED", label: "Shared" },
  { value: "PG", label: "PG" },
  { value: "FLAT", label: "Flat" },
];

const GENDER_OPTIONS: { value: GenderPreference; label: string }[] = [
  { value: "ANY", label: "Any" },
  { value: "MALE", label: "Boys" },
  { value: "FEMALE", label: "Girls" },
];

// ── Dropdown section ──────────────────────────────────────────────────────────
function DropdownSection<T extends string>({
  id,
  sectionLabel,
  placeholder,
  current,
  options,
  paramKey,
  onSelect,
}: {
  id: string;
  sectionLabel: string;
  placeholder: string;
  current: string;
  options: { value: T; label: string }[];
  paramKey: string;
  onSelect: (key: string, value: string) => void;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const handleSelect = (value: T) => {
    onSelect(paramKey, current === value ? "" : value);
    if (detailsRef.current) detailsRef.current.open = false;
  };

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        detailsRef.current.open &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        detailsRef.current.open = false;
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const activeLabel = options.find((o) => o.value === current)?.label;

  return (
    <details ref={detailsRef} name="searchbar-dropdowns" className="group relative">
      <summary
        id={id}
        className="flex cursor-pointer list-none flex-col gap-0.5 px-5 py-3 select-none"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {sectionLabel}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <span className={activeLabel ? "text-primary" : "text-muted-foreground"}>
            {activeLabel ?? placeholder}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-180" />
        </span>
      </summary>

      {/* Popover */}
      <div className="absolute top-full left-0 z-50 mt-2 min-w-[180px] rounded-xl border bg-card p-2 shadow-md">
        <div className="flex flex-wrap gap-1.5 p-1">
          {options.map(({ value, label }) => {
            const active = current === value;
            return (
              <button
                key={value}
                id={`${id}-option-${value.toLowerCase()}`}
                onClick={() => handleSelect(value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/30 text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </details>
  );
}

// ── Main SearchBar ─────────────────────────────────────────────────────────────
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateParam("city", e.target.value.trim());
      }, 300);
    },
    [updateParam]
  );

  return (
    <div
      className={[
        // Mobile: vertical stack
        "flex flex-col divide-y divide-border",
        "bg-card border rounded-xl",
        // Desktop: horizontal row
        "sm:flex-row sm:divide-y-0 sm:divide-x sm:divide-border sm:items-stretch",
      ].join(" ")}
    >
      {/* Section 1 — City */}
      <div className="flex flex-col gap-0.5 px-5 py-3 sm:flex-1">
        <label
          htmlFor="searchbar-city"
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Destination
        </label>
        <input
          id="searchbar-city"
          type="text"
          defaultValue={activeCity}
          placeholder="Search city or locality"
          onChange={handleCityChange}
          className="bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
          autoComplete="off"
        />
      </div>

      {/* Section 2 — Room type */}
      <div className="sm:flex-1">
        <DropdownSection
          id="searchbar-roomtype"
          sectionLabel="Type"
          placeholder="Room type"
          current={activeRoomType}
          options={ROOM_TYPE_OPTIONS}
          paramKey="roomType"
          onSelect={updateParam}
        />
      </div>

      {/* Section 3 — Gender preference */}
      <div className="sm:flex-1">
        <DropdownSection
          id="searchbar-gender"
          sectionLabel="Gender"
          placeholder="For who?"
          current={activeGender}
          options={GENDER_OPTIONS}
          paramKey="genderPreference"
          onSelect={updateParam}
        />
      </div>

      {/* Search button */}
      <div className="flex items-center justify-end px-3 py-2 sm:py-0">
        <button
          id="searchbar-submit"
          aria-label="Search listings"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20 active:scale-95"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
