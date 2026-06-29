"use client";

import Link from "next/link";
import { PlusCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-6 rounded-2xl border border-white/[0.07] bg-[#111]/60 px-8 py-20 text-center">
      {/* Illustration-like icon cluster */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-xl" aria-hidden />
        {/* Inner circle */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#1a1a1a]">
          <Home className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
        </div>
        {/* Small decorative dot top-right */}
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full border border-white/10 bg-violet-500/20 flex items-center justify-center">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" aria-hidden />
        </span>
      </div>

      {/* Copy */}
      <div className="max-w-xs space-y-2">
        <h3 className="text-base font-semibold text-foreground">
          No listings yet
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You haven&apos;t created any listings yet. Start listing your space and
          reach thousands of renters on StayZ.
        </p>
      </div>

      {/* CTA */}
      <Button
        asChild
        className="mt-2 gap-2 rounded-lg bg-white text-black hover:bg-white/90 font-medium shadow-lg"
      >
        <Link href="/add-listing">
          <PlusCircle className="h-4 w-4" />
          Create Your First Listing
        </Link>
      </Button>
    </div>
  );
}
