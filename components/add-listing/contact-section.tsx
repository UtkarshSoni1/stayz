"use client"

import { Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ContactSectionProps {
  data: {
    phone: string
  }
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

export function ContactSection({ data, onChange, errors }: ContactSectionProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
            <Phone className="h-4 w-4 text-green-400" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Contact
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              How tenants can reach you
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="phone-number" className="text-sm font-medium">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <div className="relative flex items-center">
            <span className="absolute left-3 flex items-center text-sm text-muted-foreground font-medium select-none pointer-events-none">
              +91
            </span>
            <Input
              id="phone-number"
              type="tel"
              placeholder="98765 43210"
              value={data.phone}
              onChange={(e) => {
                // Only allow digits
                const raw = e.target.value.replace(/\D/g, "").slice(0, 10)
                onChange("phone", raw)
              }}
              maxLength={10}
              aria-invalid={!!errors.phone}
              className="h-10 pl-11 bg-background/50 border-border/60 focus-visible:border-green-400/50 focus-visible:ring-green-400/20 placeholder:text-muted-foreground/50 tracking-wider"
            />
          </div>
          {errors.phone ? (
            <p className="text-xs text-destructive flex items-center gap-1.5">
              <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
              {errors.phone}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/60">
              This number will be visible to interested tenants
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
