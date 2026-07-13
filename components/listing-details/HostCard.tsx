"use client";

import type { Host } from "@/types/listing-detail";
import { Badge } from "./Badge";
import Link from "next/link";

interface HostCardProps {
  host: Host;
}

function HostStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 text-center">
      <span className="text-lg font-semibold text-white">{value}</span>
      <span className="text-sm text-white/70">{label}</span>
    </div>
  );
}

export function HostCard({ host }: HostCardProps) {
  return (
    <section className="border-b border-white/10 pb-10 mb-10">
      <h2 className="text-2xl font-semibold text-white mb-8">Meet your host</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left column — profile card & personal details */}
        <div>
          <div className="bg-[#111] rounded-2xl border border-white/10 p-6 flex gap-6">
            <div className="flex flex-col items-center shrink-0">
              <Link href={`/owners/${host.id}`} className="group">
                <div className="relative mb-3">
                  <img
                    src={host.avatarUrl}
                    alt={host.avatarAlt}
                    className="w-24 h-24 rounded-full object-cover group-hover:ring-2 group-hover:ring-primary/50 transition-all"
                  />
                  <span className="absolute bottom-0 right-0 w-7 h-7 bg-[#ff385c] rounded-full flex items-center justify-center border-2 border-[#111]">
                    <span
                      className="material-symbols-outlined text-white text-sm"
                      style={{ fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 20' }}
                    >
                      check
                    </span>
                  </span>
                </div>
                <p className="text-xl font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                  {host.name}
                </p>
              </Link>
              {host.isSuperhost && (
                <Badge className="bg-transparent text-white/90 normal-case tracking-normal font-semibold gap-1.5 px-0">
                  <span className="material-symbols-outlined text-base text-primary">emoji_events</span>
                  Superhost
                </Badge>
              )}
            </div>

            <div className="flex-1 flex flex-col divide-y divide-white/10">
              <HostStat value={String(host.reviewCount)} label="Reviews" />
              <HostStat
                value={`${host.rating.toFixed(1)} ★`}
                label="Rating"
              />
              <HostStat
                value={String(host.yearsHosting)}
                label={host.yearsHosting === 1 ? "Year hosting" : "Years hosting"}
              />
            </div>
          </div>

          <ul className="mt-6 space-y-4">
            {host.personalDetails.map((detail) => (
              <li key={detail.text} className="flex items-center gap-3 text-white/70">
                <span className="material-symbols-outlined text-xl text-white/50">
                  {detail.icon}
                </span>
                <span>{detail.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column — description & actions */}
        <div className="flex flex-col">
          {host.isSuperhost && (
            <>
              <h3 className="text-lg font-semibold text-white mb-3">
                {host.name} is a Superhost
              </h3>
              <p className="text-white/70 leading-relaxed mb-8">{host.superhostDescription}</p>
            </>
          )}

          <div className="mb-8">
            <h4 className="font-semibold text-white mb-3">Host details</h4>
            <ul className="space-y-1 text-white/70">
              <li>Response rate: {host.responseRate}</li>
              <li>Responds {host.responseTime}</li>
            </ul>
          </div>

          <button
            type="button"
            className="self-start px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 active:scale-95 transition-all"
          >
            Message host
          </button>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/10 flex items-start gap-3">
        <span className="material-symbols-outlined text-white/50 text-xl shrink-0 mt-0.5">
          shield
        </span>
        <p className="text-sm text-white/50 leading-relaxed">{host.safetyDisclaimer}</p>
      </div>
    </section>
  );
}
