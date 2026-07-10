"use client";

import { useEffect, useRef, useState } from "react";
import type { BookingInfo } from "@/types/listing-detail";
import { formatCurrency } from "@/data/listing-detail";

const sectionLinks = [
  { label: "Photos",    href: "#photos" },
  { label: "Amenities", href: "#amenities" },
  { label: "Reviews",   href: "#reviews" },
  { label: "Location",  href: "#location" },
];

interface ListingNavBarProps {
  booking: BookingInfo;
  bookingCardId?: string;
}

export function ListingNavBar({
  booking,
  bookingCardId = "booking-card-sentinel",
}: ListingNavBarProps) {
  const [bookingVisible, setBookingVisible] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sentinel = document.getElementById(bookingCardId);
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setBookingVisible(entry.isIntersecting);
      },
      {
        // trigger when at least 1 px of the sentinel is visible
        threshold: 0,
        // shrink the root viewport slightly so the nav itself doesn't interfere
        rootMargin: "-80px 0px 0px 0px",
      }
    );

    observerRef.current.observe(sentinel);
    return () => observerRef.current?.disconnect();
  }, [bookingCardId]);

  const total = booking.monthlyRent + (booking.deposit ?? 0);
 
  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-outline-variant/30 bg-[#0a0a0a]/95 backdrop-blur-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16">
 
        {/* ── Section anchor links (always visible) ─────────────────────── */}
        <div className="flex items-center gap-8">
          {sectionLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors underline-offset-4 hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
 
        {/* ── Compact booking widget (slides in when card leaves viewport) ─ */}
        <div
          className={`flex items-center gap-4 transition-all duration-300 ${
            bookingVisible
              ? "opacity-0 pointer-events-none translate-y-1"
              : "opacity-100 pointer-events-auto translate-y-0"
          }`}
        >
          {/* Price & label */}
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface leading-tight">
              {formatCurrency(booking.monthlyRent, booking.currency)}{" "}
              <span className="font-normal text-on-surface-variant">/ month</span>
            </p>
            {booking.deposit !== undefined && booking.deposit > 0 && (
              <p className="text-[10px] text-on-surface-variant">
                + {formatCurrency(booking.deposit, booking.currency)} deposit
              </p>
            )}
          </div>
 
          {/* Contact button */}
          <button
            type="button"
            onClick={() => {
              const card = document.getElementById("booking-card-sentinel");
              if (card) {
                card.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
            className="bg-primary hover:opacity-90 active:scale-95 text-primary-foreground font-bold text-sm px-5 py-2.5 rounded-full transition-all shadow-md"
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
