"use client";

import Link from "next/link";

interface DashboardButtonProps {
  isLoggedIn: boolean;
}

export default function DashboardButton({ isLoggedIn }: DashboardButtonProps) {
  return (
    <Link
      id="dashboard-button"
      href={isLoggedIn ? "/dashboard" : "/auth/login"}
      className="inline-flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {isLoggedIn ? "Dashboard" : "Sign in"}
    </Link>
  );
}
