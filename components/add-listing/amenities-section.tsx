"use client"

import { Sparkles, Wifi, Wind, Car, ShowerHead, ChefHat, Trees, Zap, Refrigerator, Flame, Camera, Building2, Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AmenitiesSectionProps {
  selected: string[]
  onToggle: (amenity: string) => void
}

const AMENITIES = [
  { id: "WIFI", label: "WiFi", icon: Wifi, color: "text-sky-400", bg: "bg-sky-500/10" },
  { id: "AC", label: "AC", icon: Wind, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { id: "PARKING", label: "Parking", icon: Car, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { id: "LAUNDRY", label: "Laundry", icon: ShowerHead, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "KITCHEN", label: "Kitchen", icon: ChefHat, color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: "BALCONY", label: "Balcony", icon: Trees, color: "text-green-400", bg: "bg-green-500/10" },
  { id: "POWER_BACKUP", label: "Power Backup", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "REFRIGERATOR", label: "Refrigerator", icon: Refrigerator, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { id: "GEYSER", label: "Geyser", icon: Flame, color: "text-red-400", bg: "bg-red-500/10" },
  { id: "CCTV", label: "CCTV", icon: Camera, color: "text-slate-400", bg: "bg-slate-500/10" },
  { id: "LIFT", label: "Lift", icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "RO_WATER", label: "RO Water", icon: Droplets, color: "text-teal-400", bg: "bg-teal-500/10" },
]

export function AmenitiesSection({ selected, onToggle }: AmenitiesSectionProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Amenities
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              {selected.length > 0
                ? `${selected.length} amenit${selected.length === 1 ? "y" : "ies"} selected`
                : "Select what your place offers"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {AMENITIES.map(({ id, label, icon: Icon, color, bg }) => {
            const isSelected = selected.includes(id)
            return (
              <button
                key={id}
                id={`amenity-${id.toLowerCase()}`}
                type="button"
                onClick={() => onToggle(id)}
                aria-pressed={isSelected}
                className={cn(
                  "group relative flex flex-col items-center gap-2.5 rounded-xl border p-4 text-center transition-all duration-200 cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                  isSelected
                    ? "border-primary/30 bg-primary/8 shadow-sm shadow-primary/10"
                    : "border-border/50 bg-background/30 hover:border-border hover:bg-muted/30"
                )}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                    <svg className="h-2.5 w-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}

                {/* Icon */}
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
                  isSelected ? bg : "bg-muted/50 group-hover:bg-muted"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isSelected ? color : "text-muted-foreground group-hover:text-foreground"
                  )} />
                </div>

                {/* Label */}
                <span className={cn(
                  "text-xs font-medium leading-tight transition-colors duration-200",
                  isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
