"use client";

import { useState, useCallback } from "react";
import type { BookingInfo, Host } from "@/types/listing-detail";
import { formatCurrency } from "@/data/listing-detail";
import { StarRating } from "./StarRating";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Strip all non-digit characters from a phone/WA number */
function digitsOnly(str: string): string {
  return str.replace(/\D/g, "");
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface BookingCardProps {
  booking: BookingInfo;
  host: Host;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BookingCard({ booking, host }: BookingCardProps) {
  const [moveInDate, setMoveInDate] = useState("");
  const [guests, setGuests] = useState(1);

  const total = booking.monthlyRent + (booking.deposit ?? 0);
  const hasWhatsApp = !!host.whatsappNumber;
  const hasPhone = !!host.phone;
  const hasContactInfo = hasWhatsApp || hasPhone;

  const decrementGuests = () => setGuests((g) => Math.max(1, g - 1));
  const incrementGuests = () =>
    setGuests((g) => Math.min(booking.maxGuests, g + 1));

  /** Fire-and-forget analytics hit — never blocks the user action */
  const trackContactClick = useCallback(() => {
    fetch(`/api/listings/${booking.listingId}/contact-click`, {
      method: "POST",
    }).catch(() => {
      /* intentionally swallowed */
    });
  }, [booking.listingId]);

  // Build the WhatsApp pre-fill message
  const buildWhatsAppUrl = useCallback(() => {
    const digits = digitsOnly(host.whatsappNumber ?? "");
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://stayz.vercel.app";
    const listingUrl = `${baseUrl}/listings/${booking.listingId}`;
    const dateClause = moveInDate ? `moving in ${moveInDate}, ` : "";
    const guestClause = `${guests} guest${guests !== 1 ? "s" : ""}`;
    const message = `Hi, interested in "${booking.listingTitle}" on StayZ (${dateClause}${guestClause}): ${listingUrl}`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }, [host.whatsappNumber, booking, moveInDate, guests]);

  return (
    <div className="md:col-span-1 mt-2">
      <div className="glass-card p-10 rounded-3xl sticky top-28 shadow-2xl border border-white/10 bg-[#111]">
        {/* Price header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="font-display-lg text-headline-lg text-white">
              {formatCurrency(booking.monthlyRent, booking.currency)}
            </span>
            <span className="text-on-surface-variant">/ month</span>
          </div>
          <StarRating rating={booking.rating} />
        </div>

        {/* Move-in date + guests inputs */}
        <div className="border border-outline-variant rounded-2xl overflow-hidden mb-8">
          <div className="p-4 border-b border-outline-variant">
            <label
              htmlFor="move-in-date"
              className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1"
            >
              Move-in date
            </label>
            <input
              id="move-in-date"
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full bg-transparent text-white font-label-bold outline-none"
            />
          </div>

          <div className="p-4 flex items-center justify-between">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                Guests
              </label>
              <span className="text-white font-label-bold">
                {guests} guest{guests !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decrementGuests}
                disabled={guests <= 1}
                aria-label="Decrease guests"
                className="w-8 h-8 rounded-full border border-outline-variant text-white flex items-center justify-center disabled:opacity-30 hover:bg-surface-container transition-colors"
              >
                −
              </button>
              <button
                type="button"
                onClick={incrementGuests}
                disabled={guests >= booking.maxGuests}
                aria-label="Increase guests"
                className="w-8 h-8 rounded-full border border-outline-variant text-white flex items-center justify-center disabled:opacity-30 hover:bg-surface-container transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        {hasContactInfo ? (
          <div className="flex flex-col gap-3 mb-6">
            {hasWhatsApp && (
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackContactClick}
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-4 rounded-full font-display-lg text-lg font-bold transition-all shadow-lg active:scale-95"
              >
                {/* WhatsApp SVG icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Message on WhatsApp
              </a>
            )}
            {hasPhone && (
              <a
                href={`tel:${host.phone}`}
                onClick={trackContactClick}
                className="w-full flex items-center justify-center gap-2 border border-outline-variant text-white py-4 rounded-full font-display-lg text-lg font-bold transition-all hover:bg-surface-container active:scale-95"
              >
                <span className="material-symbols-outlined text-xl leading-none" aria-hidden="true">
                  call
                </span>
                Call Owner
              </a>
            )}
          </div>
        ) : (
          <div className="w-full text-center text-on-surface-variant border border-outline-variant/40 rounded-full py-4 mb-6 text-sm font-medium opacity-60 select-none">
            Contact info not available yet
          </div>
        )}

        <p className="text-center text-on-surface-variant text-sm mb-6">
          Contact the owner to check availability
        </p>

        {/* Price breakdown */}
        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <div className="flex justify-between text-on-surface">
            <span>Monthly rent</span>
            <span>{formatCurrency(booking.monthlyRent, booking.currency)}</span>
          </div>
          {booking.deposit !== undefined && booking.deposit > 0 && (
            <div className="flex justify-between text-on-surface">
              <span>Security deposit</span>
              <span>{formatCurrency(booking.deposit, booking.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-white font-bold text-xl pt-4 border-t border-outline-variant/30">
            <span>Total (1st month)</span>
            <span>{formatCurrency(total, booking.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
