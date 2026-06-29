"use client";

import { Home, CheckCircle, FileEdit, KeyRound } from "lucide-react";

interface SummaryCardsProps {
  total: number;
  active: number;
  draft: number;
  rented: number;
}

const cards = [
  {
    key: "total" as const,
    label: "Total Listings",
    icon: Home,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/10",
  },
  {
    key: "active" as const,
    label: "Active Listings",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
  {
    key: "draft" as const,
    label: "Draft Listings",
    icon: FileEdit,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/10",
  },
  {
    key: "rented" as const,
    label: "Rented Out",
    icon: KeyRound,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    glow: "shadow-zinc-500/10",
  },
];

export function SummaryCards({ total, active, draft, rented }: SummaryCardsProps) {
  const values = { total, active, draft, rented };

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className={`
              relative overflow-hidden rounded-xl border ${card.border}
              bg-[#111]/80 p-4 backdrop-blur-sm
              shadow-lg ${card.glow}
              transition-all duration-300 hover:-translate-y-0.5
              hover:border-white/10
            `}
          >
            {/* Subtle background gradient */}
            <div
              className={`absolute inset-0 opacity-30 ${card.bg}`}
              style={{
                background: `radial-gradient(ellipse at top right, var(--tw-shadow-color, transparent) 0%, transparent 70%)`,
              }}
              aria-hidden
            />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  {card.label}
                </p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
                  {values[card.key]}
                </p>
              </div>
              <div className={`rounded-lg p-2 ${card.bg} border ${card.border}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
