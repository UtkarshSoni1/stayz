"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const MinimalNavBar: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

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
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to listings</span>
        </button>

        {/* Right: Session Avatar (only if session exists) */}
        {session?.user && (
          <Link
            href="/dashboard"
            className="flex items-center hover:opacity-85 transition-opacity"
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
          </Link>
        )}
      </div>
    </header>
  );
};
export default MinimalNavBar;
