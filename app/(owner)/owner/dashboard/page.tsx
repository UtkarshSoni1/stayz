export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardSummary } from "@/lib/dashboard-service";
import { AppNavBar } from "@/components/navbar/AppNavBar";
import {
  Home,
  PlusCircle,
  List,
  User,
  MapPin,
  Star,
  TrendingUp,
  KeyRound,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Owner Dashboard | StayZ",
  description: "Manage your listings, track performance, and grow your rental business.",
};

export default async function OwnerDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  // Fetch real summary — server component, no waterfall
  const summary = await getDashboardSummary(user.id);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0].toUpperCase() ?? "U";

  const stats = [
    {
      label: "Total Listings",
      value: String(summary.total),
      icon: Home,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active Listings",
      value: String(summary.active),
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Avg. Rating",
      value: summary.avgRating !== null ? String(summary.avgRating) : "—",
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Rented Out",
      value: String(summary.rented),
      icon: KeyRound,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppNavBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s what&apos;s happening with your StayZ account.
          </p>
        </div>

        {/* Stats Grid — real data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Extra stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Draft Listings", value: summary.draft },
            { label: "Total Reviews", value: summary.totalReviews },
            { label: "Total Saves", value: summary.totalSaves },
          ].map((item) => (
            <div key={item.label} className="bg-card border rounded-xl p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-5">
              <h2 className="font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                {[
                  { label: "List a New Property", href: "/owner/add-listing", icon: PlusCircle, desc: "Start earning today" },
                  { label: "My Listings", href: "/owner/my-listings", icon: List, desc: "Manage your properties" },
                  { label: "Browse Stays", href: "/listings", icon: MapPin, desc: "Find your next stay" },
                  { label: "Edit Profile", href: "/owner/profile", icon: User, desc: "Update your info" },
                ].map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
                  >
                    <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <action.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Getting Started / Account info */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-xl p-5 h-full">
              <h2 className="font-semibold mb-4">Getting Started</h2>
              <div className="space-y-3">
                {[
                  {
                    step: "1",
                    title: "Complete your profile",
                    desc: "Add a photo and bio to build trust with guests.",
                    done: !!user.image,
                  },
                  {
                    step: "2",
                    title: "List your first property",
                    desc: "Add photos, amenities, and set your pricing.",
                    done: summary.total > 0,
                  },
                  {
                    step: "3",
                    title: "Get your first booking",
                    desc: "Share your listing and start welcoming guests.",
                    done: summary.rented > 0,
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      item.done ? "bg-green-500/5 border-green-500/20" : "bg-muted/30"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        item.done
                          ? "bg-green-500 text-white"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {item.done ? "✓" : item.step}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${item.done ? "line-through text-muted-foreground" : ""}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Account info */}
              <div className="mt-6 pt-5 border-t">
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Account</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    {user.email}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                    {user.role?.toLowerCase() ?? "owner"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
