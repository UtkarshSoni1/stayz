"use client";

import React, { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export const TopNavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const iconColor = scrolled ? "black" : "white";
  const textColor = scrolled ? "text-black" : "text-white";
  const dividerColor = scrolled ? "bg-black/20" : "bg-white/30";

  return (
    <nav
      className={`
        fixed z-50 flex items-center
        transition-all duration-500 ease-in-out
        ${scrolled
          ? "left-1/2 -translate-x-1/2 top-4 w-fit rounded-full bg-white px-6 py-2.5 justify-center gap-6"
          : "left-0 right-0 top-0 rounded-none bg-transparent px-10 py-4 justify-between gap-8"
        }
      `}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <Home size={scrolled ? 17 : 22} color={iconColor} strokeWidth={2.5} className="transition-all duration-500" />
        <span className={`font-extrabold tracking-tight transition-all duration-500 ${scrolled ? "text-base text-black" : "text-xl text-white"}`}>
          StayZ
        </span>
      </Link>

      {/* Divider — only in pill */}
      {scrolled && <div className="w-px h-4 bg-black/20 shrink-0" />}

      {/* Nav links */}
      <div className={`flex items-center transition-all duration-500 ${scrolled ? "gap-6" : "gap-8"}`}>
        <Link
          href="/listings"
          className={`text-sm font-semibold hover:opacity-60 transition-opacity whitespace-nowrap ${textColor}`}
        >
          {scrolled ? "Browse" : "Listings"}
        </Link>

        {/* Auth */}
        {session?.user ? (
          <>
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 text-sm font-semibold hover:opacity-60 transition-opacity ${textColor}`}
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "Profile"}
                  className={`rounded-full object-cover transition-all duration-500 ${scrolled ? "w-6 h-6" : "w-7 h-7"}`}
                />
              ) : (
                <div
                  className={`rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                    ${scrolled
                      ? "w-6 h-6 bg-black/10 text-black"
                      : "w-7 h-7 bg-white/20 text-white"
                    }`}
                >
                  {(session.user.name ?? "U")[0].toUpperCase()}
                </div>
              )}
              {!scrolled && (
                <span className={`font-semibold text-sm ${textColor}`}>
                  {session.user.name?.split(" ")[0]}
                </span>
              )}
            </Link>
            
            <div className={`w-px h-4 shrink-0 ${dividerColor}`} />
            
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className={`text-sm font-semibold hover:opacity-60 transition-opacity whitespace-nowrap ${textColor}`}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <div className={`w-px h-4 shrink-0 ${dividerColor}`} />
            <Link
              href="/login"
              className={`text-sm font-semibold hover:opacity-60 transition-opacity whitespace-nowrap ${textColor}`}
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};