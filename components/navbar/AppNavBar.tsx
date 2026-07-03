"use client";

import React from "react";
import { Home } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function getDashboardHref(role?: string | null): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "OWNER":
      return "/owner/dashboard";
    default:
      return "/user/dashboard";
  }
}

export const AppNavBar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;
  const dashboardHref = getDashboardHref(role);

  // Links visible to all authenticated users
  const baseLinks = [
    { label: "Dashboard", href: dashboardHref },
    { label: "Browse", href: "/listings" },
  ];

  // Owner-only links
  const ownerLinks =
    role === "OWNER" || role === "ADMIN"
      ? [
          { label: "My Listings", href: "/owner/my-listings" },
          { label: "List a Property", href: "/owner/add-listing" },
        ]
      : [];

  const links = session?.user ? [...baseLinks, ...ownerLinks] : [{ label: "Browse", href: "/listings" }];

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user?.email?.[0].toUpperCase() ?? "U";

  return (
    <header className="w-full bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Home size={20} className="shrink-0" />
          <span className="font-bold text-lg tracking-tight">StayZ</span>
        </Link>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Session Auth / Avatar */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <Link
              href={dashboardHref}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "Profile"}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium">
                {session.user.name?.split(" ")[0] ?? "User"}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
