"use client"

import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LocationSectionProps {
  data: {
    city: string
    locality: string
    address: string
    pincode: string
  }
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

export function LocationSection({ data, onChange, errors }: LocationSectionProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
            <MapPin className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Location
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Where is your property located?
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* City & Locality Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">
              City <span className="text-destructive">*</span>
            </Label>
            <Input
              id="city"
              placeholder="e.g. Bengaluru"
              value={data.city}
              onChange={(e) => onChange("city", e.target.value)}
              aria-invalid={!!errors.city}
              className="h-10 bg-background/50 border-border/60 focus-visible:border-blue-400/50 focus-visible:ring-blue-400/20 placeholder:text-muted-foreground/50"
            />
            {errors.city && (
              <p className="text-xs text-destructive flex items-center gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                {errors.city}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="locality" className="text-sm font-medium">
              Locality <span className="text-destructive">*</span>
            </Label>
            <Input
              id="locality"
              placeholder="e.g. Koramangala"
              value={data.locality}
              onChange={(e) => onChange("locality", e.target.value)}
              aria-invalid={!!errors.locality}
              className="h-10 bg-background/50 border-border/60 focus-visible:border-blue-400/50 focus-visible:ring-blue-400/20 placeholder:text-muted-foreground/50"
            />
            {errors.locality && (
              <p className="text-xs text-destructive flex items-center gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                {errors.locality}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Address{" "}
            <span className="text-muted-foreground/60 text-xs font-normal">(optional)</span>
          </Label>
          <Input
            id="address"
            placeholder="e.g. 42B, 5th Cross, 7th Block"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="h-10 bg-background/50 border-border/60 focus-visible:border-blue-400/50 focus-visible:ring-blue-400/20 placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Pincode */}
        <div className="space-y-2">
          <Label htmlFor="pincode" className="text-sm font-medium">
            Pincode <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pincode"
            placeholder="e.g. 560034"
            value={data.pincode}
            onChange={(e) => onChange("pincode", e.target.value)}
            maxLength={6}
            aria-invalid={!!errors.pincode}
            className="h-10 bg-background/50 border-border/60 focus-visible:border-blue-400/50 focus-visible:ring-blue-400/20 placeholder:text-muted-foreground/50 max-w-[200px]"
          />
          {errors.pincode && (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
              {errors.pincode}
            </p>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
