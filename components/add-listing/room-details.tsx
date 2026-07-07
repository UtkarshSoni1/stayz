"use client"

import { BedDouble } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface RoomDetailsProps {
  data: {
    roomType: string
    furnishing: string
    genderPreference: string
  }
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

type OptionItem = { label: string; value: string; emoji?: string }

const ROOM_TYPES: OptionItem[] = [
  { label: "Single", value: "SINGLE", emoji: "🛏️" },
  { label: "Shared", value: "SHARED", emoji: "🛌" },
  { label: "PG", value: "PG", emoji: "🏠" },
  { label: "Flat", value: "FLAT", emoji: "🏢" },
]

const FURNISHING: OptionItem[] = [
  { label: "Furnished", value: "FURNISHED" },
  { label: "Semi Furnished", value: "SEMI_FURNISHED" },
  { label: "Unfurnished", value: "UNFURNISHED" },
]

const GENDER_PREFERENCE: OptionItem[] = [
  { label: "Male", value: "MALE", emoji: "👨" },
  { label: "Female", value: "FEMALE", emoji: "👩" },
  { label: "Any", value: "ANY", emoji: "🤝" },
]

function OptionPill({
  item,
  selected,
  onSelect,
  id,
}: {
  item: OptionItem
  selected: boolean
  onSelect: (value: string) => void
  id: string
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={() => onSelect(item.value)}
      aria-pressed={selected}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        selected
          ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
          : "border-border/50 bg-background/40 text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/40"
      )}
    >
      {item.emoji && <span className="text-base leading-none">{item.emoji}</span>}
      {item.label}
    </button>
  )
}

export function RoomDetails({ data, onChange, errors }: RoomDetailsProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
            <BedDouble className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Room Details
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Specifics about the room or property
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Room Type */}
        <div className="space-y-2.5">
          <Label className="text-sm font-medium">
            Room Type <span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {ROOM_TYPES.map((item) => (
              <OptionPill
                key={item.value}
                id={`room-type-${item.value.toLowerCase()}`}
                item={item}
                selected={data.roomType === item.value}
                onSelect={(v) => onChange("roomType", v)}
              />
            ))}
          </div>
          {errors.roomType && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
              {errors.roomType}
            </p>
          )}
        </div>

        {/* Furnishing */}
        <div className="space-y-2.5">
          <Label className="text-sm font-medium">
            Furnishing <span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {FURNISHING.map((item) => (
              <OptionPill
                key={item.value}
                id={`furnishing-${item.value.toLowerCase()}`}
                item={item}
                selected={data.furnishing === item.value}
                onSelect={(v) => onChange("furnishing", v)}
              />
            ))}
          </div>
          {errors.furnishing && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
              {errors.furnishing}
            </p>
          )}
        </div>

        {/* Gender Preference */}
        <div className="space-y-2.5">
          <Label className="text-sm font-medium">
            Gender Preference <span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {GENDER_PREFERENCE.map((item) => (
              <OptionPill
                key={item.value}
                id={`gender-${item.value.toLowerCase()}`}
                item={item}
                selected={data.genderPreference === item.value}
                onSelect={(v) => onChange("genderPreference", v)}
              />
            ))}
          </div>
          {errors.genderPreference && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
              {errors.genderPreference}
            </p>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
