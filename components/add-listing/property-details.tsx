"use client"

import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PropertyDetailsProps {
  data: {
    title: string
    description: string
  }
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

export function PropertyDetails({ data, onChange, errors }: PropertyDetailsProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Property Details
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Basic information about your listing
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Listing Title */}
        <div className="space-y-2">
          <Label htmlFor="listing-title" className="text-sm font-medium text-foreground">
            Listing Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="listing-title"
            placeholder="e.g. Cozy 1BHK near Metro Station"
            value={data.title}
            onChange={(e) => onChange("title", e.target.value)}
            aria-invalid={!!errors.title}
            className="h-10 bg-background/50 border-border/60 focus-visible:border-primary/50 focus-visible:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-200"
          />
          {errors.title && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="listing-description" className="text-sm font-medium text-foreground">
            Description <span className="text-destructive">*</span>
          </Label>
          <textarea
            id="listing-description"
            placeholder="Describe your place — vibe, surroundings, house rules, who it's perfect for..."
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={5}
            aria-invalid={!!errors.description}
            className="w-full min-h-[120px] rounded-md border border-border/60 bg-background/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 shadow-xs transition-all duration-200 outline-none focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-primary/20 resize-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
          />
          <div className="flex items-center justify-between">
            {errors.description ? (
              <p className="text-xs text-destructive flex items-center gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                {errors.description}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-muted-foreground/60">
              {data.description.length} chars
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
