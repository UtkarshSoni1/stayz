"use client"

import { IndianRupee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PricingSectionProps {
  data: {
    monthlyRent: string
    securityDeposit: string
  }
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

export function PricingSection({ data, onChange, errors }: PricingSectionProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
            <IndianRupee className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Pricing
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Set your rent and deposit amounts
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Monthly Rent */}
          <div className="space-y-2">
            <Label htmlFor="monthly-rent" className="text-sm font-medium">
              Monthly Rent <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none">
                ₹
              </span>
              <Input
                id="monthly-rent"
                type="number"
                placeholder="8,000"
                value={data.monthlyRent}
                onChange={(e) => onChange("monthlyRent", e.target.value)}
                aria-invalid={!!errors.monthlyRent}
                min={0}
                className="h-10 pl-7 bg-background/50 border-border/60 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20 placeholder:text-muted-foreground/50"
              />
            </div>
            {errors.monthlyRent ? (
              <p className="text-xs text-destructive flex items-center gap-1.5">
                <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
                {errors.monthlyRent}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground/60">Per month, in INR</p>
            )}
          </div>

          {/* Security Deposit */}
          <div className="space-y-2">
            <Label htmlFor="security-deposit" className="text-sm font-medium">
              Security Deposit{" "}
              <span className="text-muted-foreground/60 text-xs font-normal">(optional)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none">
                ₹
              </span>
              <Input
                id="security-deposit"
                type="number"
                placeholder="16,000"
                value={data.securityDeposit}
                onChange={(e) => onChange("securityDeposit", e.target.value)}
                min={0}
                className="h-10 pl-7 bg-background/50 border-border/60 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20 placeholder:text-muted-foreground/50"
              />
            </div>
            <p className="text-xs text-muted-foreground/60">Refundable at move-out</p>
          </div>
        </div>

        {/* Pricing Preview */}
        {data.monthlyRent && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
              Pricing Summary
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-400">
                ₹{Number(data.monthlyRent).toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            {data.securityDeposit && (
              <p className="text-xs text-muted-foreground/70 mt-1">
                + ₹{Number(data.securityDeposit).toLocaleString("en-IN")} deposit
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
