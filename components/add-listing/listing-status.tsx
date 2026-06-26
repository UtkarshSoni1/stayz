"use client"

import { ToggleLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ListingStatusProps {
  status: "DRAFT" | "ACTIVE"
  onChange: (status: "DRAFT" | "ACTIVE") => void
}

const STATUS_OPTIONS = [
  {
    value: "DRAFT" as const,
    label: "Draft",
    description: "Save privately, not visible to others",
    emoji: "✏️",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-400/30",
    activeBg: "bg-amber-500/8",
  },
  {
    value: "ACTIVE" as const,
    label: "Active",
    description: "Publish now and start receiving inquiries",
    emoji: "✅",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-400/30",
    activeBg: "bg-emerald-500/8",
  },
]

export function ListingStatus({ status, onChange }: ListingStatusProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-500/10">
            <ToggleLeft className="h-4 w-4 text-slate-400" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Listing Status
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Control your listing visibility
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STATUS_OPTIONS.map((option) => {
            const isSelected = status === option.value
            return (
              <label
                key={option.value}
                htmlFor={`status-${option.value.toLowerCase()}`}
                className={cn(
                  "group relative flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all duration-200",
                  "focus-within:ring-2 focus-within:ring-primary/50",
                  isSelected
                    ? `${option.border} ${option.activeBg} shadow-sm`
                    : "border-border/50 bg-background/30 hover:border-border hover:bg-muted/20"
                )}
              >
                {/* Hidden radio */}
                <input
                  type="radio"
                  id={`status-${option.value.toLowerCase()}`}
                  name="listing-status"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onChange(option.value)}
                  className="sr-only"
                />

                {/* Custom radio indicator */}
                <div className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                  isSelected
                    ? `${option.border} ${option.bg}`
                    : "border-border/60 bg-background/30"
                )}>
                  {isSelected && (
                    <div className={cn("h-1.5 w-1.5 rounded-full", option.color.replace("text-", "bg-"))} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{option.emoji}</span>
                    <span className={cn(
                      "text-sm font-semibold transition-colors duration-200",
                      isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {option.label}
                    </span>
                  </div>
                  <p className={cn(
                    "mt-1 text-xs leading-snug transition-colors duration-200",
                    isSelected ? "text-muted-foreground" : "text-muted-foreground/60"
                  )}>
                    {option.description}
                  </p>
                </div>
              </label>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
