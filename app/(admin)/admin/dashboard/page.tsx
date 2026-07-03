export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Users,
  Home,
  Building2,
  AlertTriangle,
  ChevronRight,
  Settings,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | StayZ",
  description: "System overview and management for StayZ administrators.",
};

async function getAdminStats() {
  const [totalUsers, totalOwners, totalListings] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "OWNER" } }),
    prisma.listing.count(),
  ]);

  return { totalUsers, totalOwners, totalListings, pendingReports: 0 };
}

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const stats = await getAdminStats();

  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers,
      desc: "Registered tenants",
      accent: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: Building2,
      label: "Owners",
      value: stats.totalOwners,
      desc: "Active landlords",
      accent: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      icon: Home,
      label: "Listings",
      value: stats.totalListings,
      desc: "Total properties",
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      icon: AlertTriangle,
      label: "Pending Reports",
      value: stats.pendingReports,
      desc: "Requires attention",
      accent: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
  ];

  const quickLinks = [
    {
      icon: Users,
      label: "Manage Users",
      desc: "View, edit, and moderate user accounts",
      href: "/admin/users",
      accent: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: Building2,
      label: "Manage Owners",
      desc: "Review and manage landlord accounts",
      href: "/admin/owners",
      accent: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      icon: Home,
      label: "Manage Listings",
      desc: "Review, approve, or remove listings",
      href: "/admin/listings",
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: AlertTriangle,
      label: "Reports",
      desc: "Handle user-submitted reports",
      href: "/admin/reports",
      accent: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      desc: "Platform-wide usage statistics",
      href: "/admin/analytics",
      accent: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      icon: Settings,
      label: "Settings",
      desc: "Configure platform settings",
      href: "/admin/settings",
      accent: "text-slate-400",
      bg: "bg-slate-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Bar */}
      <header className="border-b border-white/[0.08] bg-[#0d0d0d] sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <ShieldCheck className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">StayZ Admin</span>
              <span className="ml-2 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">{session.user.email}</span>
            <Link
              href="/"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-white/40">
            Platform overview and management tools.
          </p>
        </div>

        {/* ── Stats Grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl border ${card.border} bg-[#111] p-5`}
            >
              <div className={`absolute top-0 right-0 h-20 w-20 rounded-full ${card.bg} blur-2xl opacity-40`} />
              <div className="relative">
                <div className={`inline-flex items-center justify-center rounded-xl p-2 ${card.bg} mb-3`}>
                  <card.icon className={`h-5 w-5 ${card.accent}`} />
                </div>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <p className="text-sm font-medium text-white/70 mt-1">{card.label}</p>
                <p className="text-xs text-white/30 mt-0.5">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick Links ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111] p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/5">
              <ShieldCheck className="h-4 w-4 text-white/60" />
            </div>
            <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
              Management
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${link.bg}`}>
                  <link.icon className={`h-5 w-5 ${link.accent}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{link.label}</p>
                  <p className="text-xs text-white/40 mt-0.5 truncate">{link.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
