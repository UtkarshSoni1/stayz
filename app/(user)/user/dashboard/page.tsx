export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Home,
  MapPin,
  IndianRupee,
  Calendar,
  Bell,
  BookOpen,
  Heart,
  FileText,
  Zap,
  Droplets,
  Wifi,
  Wrench,
  AlertCircle,
  Phone,
  Shield,
  ChevronRight,
  Download,
  Search,
  Clock,
  CheckCircle2,
  TrendingUp,
  Building2,
  UserIcon,
} from "lucide-react";
import { AppNavBar } from "@/components/navbar/AppNavBar";

export const metadata = {
  title: "My Dashboard | StayZ",
  description: "Manage your rental, bills, and agreements from one place.",
};

// ── Helper ────────────────────────────────────────────────────────────────────
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email?.[0].toUpperCase() ?? "U";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  bg: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111] p-5">
      <div className={`absolute inset-0 opacity-5 ${bg}`} />
      <div className="relative">
        <div className={`inline-flex items-center justify-center rounded-xl p-2 ${bg} mb-3`}>
          <Icon className={`h-5 w-5 ${accent}`} />
        </div>
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/5">
        <Icon className="h-4 w-4 text-white/60" />
      </div>
      <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">{title}</h2>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.08] bg-[#111] p-5 ${className}`}>
      {children}
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  desc,
  href,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  href: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/40 mt-0.5">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40 transition-colors shrink-0" />
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function UserDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const initials = getInitials(user.name, user.email);
  const firstName = user.name?.split(" ")[0] ?? "there";

  // Mock data — real data will come from a Booking/Tenancy model in a future sprint
  const hasActiveRental = false;
  const currentDate = new Date();
  const nextDueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 5);
  const daysRemaining = Math.ceil((nextDueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AppNavBar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/users/${user.id}`} className="shrink-0">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name ?? "Profile"}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/10 hover:ring-white/25 transition-all"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-lg font-bold ring-2 ring-white/10 hover:ring-white/25 transition-all">
                {initials}
              </div>
            )}
            </Link>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-0.5">Welcome back</p>
              <h1 className="text-2xl font-bold text-white">
                Hey, {firstName}! 👋
              </h1>
              <p className="text-sm text-white/40 mt-0.5">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              Tenant
            </span>
          </div>
        </div>

        {hasActiveRental ? (
          // ── ACTIVE RENTAL VIEW ─────────────────────────────────────────────
          <div className="space-y-6">
            {/* Current Property Card */}
            <Card>
              <SectionHeader title="Current Rental" icon={Building2} />
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative h-36 sm:h-auto sm:w-48 shrink-0 overflow-hidden rounded-xl bg-white/5">
                  <div className="flex h-full items-center justify-center">
                    <Home className="h-12 w-12 text-white/20" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Cozy Studio near Tech Park</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-white/40">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-sm">Koramangala, Bengaluru</span>
                    </div>
                    <p className="text-xs text-white/30 mt-0.5">Room 204, Block A</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-white/40">Owner</p>
                      <p className="font-medium text-white">Raj Kumar</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40">Move-in Date</p>
                      <p className="font-medium text-white">Jan 15, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Rent Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={IndianRupee}
                label="Monthly Rent"
                value="₹12,000"
                sub="Due on 5th"
                accent="text-emerald-400"
                bg="bg-emerald-500/20"
              />
              <StatCard
                icon={Calendar}
                label="Next Due Date"
                value={nextDueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                sub={`${daysRemaining} days left`}
                accent="text-blue-400"
                bg="bg-blue-500/20"
              />
              <StatCard
                icon={CheckCircle2}
                label="Payment Status"
                value="Paid"
                sub="This month"
                accent="text-green-400"
                bg="bg-green-500/20"
              />
              <StatCard
                icon={Shield}
                label="Security Deposit"
                value="₹24,000"
                sub="Refundable"
                accent="text-violet-400"
                bg="bg-violet-500/20"
              />
            </div>

            {/* Bills + Agreement Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Bills */}
              <Card>
                <SectionHeader title="Bills" icon={Zap} />
                <div className="space-y-3">
                  {[
                    { icon: Zap, label: "Electricity", amount: "₹850", status: "Pending", color: "text-yellow-400", bg: "bg-yellow-500/10" },
                    { icon: Droplets, label: "Water", amount: "₹200", status: "Paid", color: "text-blue-400", bg: "bg-blue-500/10" },
                    { icon: Wrench, label: "Maintenance", amount: "₹500", status: "Paid", color: "text-orange-400", bg: "bg-orange-500/10" },
                    { icon: Wifi, label: "Internet", amount: "₹699", status: "Paid", color: "text-sky-400", bg: "bg-sky-500/10" },
                  ].map((bill) => (
                    <div key={bill.label} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bill.bg}`}>
                          <bill.icon className={`h-4 w-4 ${bill.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{bill.label}</p>
                          <p className="text-xs text-white/40">{bill.amount}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        bill.status === "Paid"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {bill.status}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full rounded-xl border border-white/[0.08] py-2.5 text-sm font-medium text-white/60 hover:text-white hover:border-white/20 transition-all">
                  View Payment History
                </button>
              </Card>

              {/* Rental Agreement + Support */}
              <div className="space-y-4">
                <Card>
                  <SectionHeader title="Rental Agreement" icon={FileText} />
                  <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Agreement Status</p>
                        <p className="text-xs text-green-400">Active & Signed</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-2.5 text-sm font-medium text-white/60 hover:text-white hover:border-white/20 transition-all">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </Card>

                <Card>
                  <SectionHeader title="Support" icon={Phone} />
                  <div className="space-y-2">
                    {[
                      { label: "Raise Complaint", icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
                      { label: "Contact Owner", icon: Phone, color: "text-blue-400", bg: "bg-blue-500/10" },
                      { label: "Emergency Contact", icon: Shield, color: "text-orange-400", bg: "bg-orange-500/10" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="w-full flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
                      >
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.bg}`}>
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                        <span className="text-sm font-medium text-white">{item.label}</span>
                        <ChevronRight className="ml-auto h-4 w-4 text-white/20" />
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          // ── NO ACTIVE RENTAL VIEW ──────────────────────────────────────────
          <div className="space-y-6">
            {/* No rental banner */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-950/40 via-[#111] to-indigo-950/40 p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/5" />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Building2 className="h-8 w-8 text-white/30" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Active Rental</h2>
                <p className="text-sm text-white/40 max-w-md mx-auto mb-6">
                  You don&apos;t have an active rental yet. Browse available listings and find your perfect space.
                </p>
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-6 py-3 text-sm font-bold hover:bg-white/90 transition-all"
                >
                  <Search className="h-4 w-4" />
                  Browse Listings
                </Link>
              </div>
            </div>

            {/* Recent Notifications placeholder */}
            <Card>
              <SectionHeader title="Notifications" icon={Bell} />
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 mb-3">
                  <Bell className="h-6 w-6 text-white/20" />
                </div>
                <p className="text-sm font-medium text-white/40">No notifications yet</p>
                <p className="text-xs text-white/20 mt-1">Updates and alerts will appear here</p>
              </div>
            </Card>
          </div>
        )}

        {/* ── Quick Actions — always visible ─────────────────────────────────── */}
        <div className="mt-6">
          <Card>
            <SectionHeader title="Quick Actions" icon={TrendingUp} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickAction
                icon={Search}
                label="Browse Listings"
                desc="Find your perfect rental space"
                href="/listings"
                accent="bg-violet-500/10 text-violet-400"
              />
              <QuickAction
                icon={Heart}
                label="Saved Listings"
                desc="View your bookmarked spaces"
                href="/user/saved"
                accent="bg-rose-500/10 text-rose-400"
              />
            </div>
          </Card>
        </div>

      </main>
    </div>
  );
}
