"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ShieldCheck,
  Settings,
  Home,
  Users,
  Building2,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "@/components/admin/SettingsDialog";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  bg: string;
  border: string;
}

const CENTER_NAV_ITEMS: NavItem[] = [
  {
    label: "Manage Listings",
    href: "/admin/listings",
    icon: Home,
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: Users,
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    label: "Manage Owners",
    href: "/admin/owners",
    icon: Building2,
    accent: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: AlertTriangle,
    accent: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
];

export function AdminNavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const renderLink = (item: NavItem, isIconOnlyOnMobile = true) => {
    const isActive = pathname.startsWith(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 select-none",
          isActive
            ? cn(item.bg, item.accent, item.border)
            : "border-transparent bg-transparent text-white/50 hover:text-white hover:bg-white/5"
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        <span className={cn(isIconOnlyOnMobile && "hidden md:inline")}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <header className="border-b border-white/[0.08] bg-[#0d0d0d] sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* LEFT Flex Region: Brand mark + Settings button */}
          <div className="flex items-center gap-4 flex-1 justify-start min-w-0">
            {/* Brand Logo */}
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 pr-3 border-r border-white/10 shrink-0"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10">
                <ShieldCheck className="h-4 w-4 text-red-400" />
              </div>
              <span className="text-xs font-bold text-white hidden sm:inline">
                StayZ Admin
              </span>
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-semibold text-red-400 uppercase tracking-wider scale-90">
                Panel
              </span>
            </Link>

            {/* Settings — opens dialog, not a route */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 select-none",
                  isSettingsOpen
                    ? "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    : "border-transparent bg-transparent text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* CENTER Flex Region: Rest of links, evenly spaced */}
          <div className="flex-[2] flex justify-around max-w-xl mx-auto md:px-2 gap-1 overflow-x-auto scrollbar-none py-1">
            {CENTER_NAV_ITEMS.map((item) => renderLink(item, true))}
          </div>

          {/* RIGHT Flex Region: Session email + Back to site link */}
          <div className="flex items-center gap-3 flex-1 justify-end shrink-0 text-xs">
            {session?.user?.email && (
              <span className="text-white/40 hidden lg:inline max-w-[120px] truncate">
                {session.user.email}
              </span>
            )}
            <Link
              href="/"
              className="text-white/40 hover:text-white transition-colors py-1.5 px-2.5 rounded-lg border border-white/15 bg-white/5 font-semibold text-[11px]"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
