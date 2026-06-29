"use client";

import { Star, MessageSquare, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingStatsProps {
  rating: number | null;
  reviews: number;
  saves: number;
  className?: string;
}

export function ListingStats({
  rating,
  reviews,
  saves,
  className,
}: ListingStatsProps) {
  return (
    <div className={cn("flex items-center gap-4 text-xs text-muted-foreground", className)}>
      <span className="flex items-center gap-1">
        <Star
          className={cn(
            "h-3.5 w-3.5",
            rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/50"
          )}
        />
        <span className={rating ? "text-foreground font-medium" : ""}>
          {rating ? rating.toFixed(1) : "—"}
        </span>
      </span>

      <span className="flex items-center gap-1">
        <MessageSquare className="h-3.5 w-3.5" />
        <span>{reviews}</span>
        <span className="text-muted-foreground/60">reviews</span>
      </span>

      <span className="flex items-center gap-1">
        <Heart className="h-3.5 w-3.5 text-rose-400/70" />
        <span>{saves}</span>
        <span className="text-muted-foreground/60">saves</span>
      </span>
    </div>
  );
}
