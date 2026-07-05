"use client";

import type { BookingInfo } from "@/types/listing-detail";
import { formatCurrency } from "@/data/listing-detail";
import { StarRating } from "./StarRating";

interface BookingCardProps {
  booking: BookingInfo;
}

export function BookingCard({ booking }: BookingCardProps) {
  const subtotal = booking.pricePerNight * booking.nights;
  const total = subtotal + booking.serviceFee;

  return (
    <div className="md:col-span-1">
      {/* Sentinel observed by ListingNavBar to toggle compact booking widget */}
      <div id="booking-card-sentinel" aria-hidden="true" />
      <div className="glass-card p-10 rounded-3xl sticky top-32 shadow-2xl border border-white/10 bg-[#111]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="font-display-lg text-headline-lg text-white">
              {formatCurrency(booking.pricePerNight, booking.currency)}
            </span>
            <span className="text-on-surface-variant">/ night</span>
          </div>
          <StarRating rating={booking.rating} />
        </div>
        <div className="border border-outline-variant rounded-2xl overflow-hidden mb-8">
          <div className="grid grid-cols-2 border-b border-outline-variant">
            <div className="p-4 border-r border-outline-variant hover:bg-surface-container transition-colors cursor-pointer">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                Check-in
              </label>
              <span className="text-white font-label-bold">{booking.checkInLabel}</span>
            </div>
            <div className="p-4 hover:bg-surface-container transition-colors cursor-pointer">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                Checkout
              </label>
              <span className="text-white font-label-bold">{booking.checkOutLabel}</span>
            </div>
          </div>
          <div className="p-4 hover:bg-surface-container transition-colors cursor-pointer">
            <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1">
              Guests
            </label>
            <span className="text-white font-label-bold">{booking.guestsLabel}</span>
          </div>
        </div>
        <button
          type="button"
          className="w-full bg-primary hover:opacity-90 text-primary-foreground py-5 rounded-full font-display-lg text-xl font-bold transition-all shadow-lg active:scale-95 mb-6"
        >
          {booking.reserveLabel}
        </button>
        <p className="text-center text-on-surface-variant text-sm mb-6">{booking.chargeNote}</p>
        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <div className="flex justify-between text-on-surface">
            <span>
              {formatCurrency(booking.pricePerNight, booking.currency)} x {booking.nights} nights
            </span>
            <span>{formatCurrency(subtotal, booking.currency)}</span>
          </div>
          <div className="flex justify-between text-on-surface">
            <span>StayZ service fee</span>
            <span>{formatCurrency(booking.serviceFee, booking.currency)}</span>
          </div>
          <div className="flex justify-between text-white font-bold text-xl pt-4 border-t border-outline-variant/30">
            <span>Total</span>
            <span>{formatCurrency(total, booking.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
