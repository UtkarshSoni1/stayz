import type { SleepingArrangement } from "@/types/listing-detail";

interface SleepingArrangementsProps {
  arrangements: SleepingArrangement[];
}

export function SleepingArrangements({ arrangements }: SleepingArrangementsProps) {
  if (arrangements.length === 0) return null;

  return (
    <section className="border-b border-outline-variant/30 pb-10 mb-10">
      <h3 className="font-headline-lg text-headline-lg text-white mb-6">Where you&apos;ll sleep</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {arrangements.map((item) => (
          <div
            key={item.id}
            className="glass-card p-6 rounded-2xl border border-white/10 bg-[#111]"
          >
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 block">
              {item.icon}
            </span>
            <p className="font-label-bold text-white mb-1">{item.name}</p>
            <p className="text-on-surface-variant text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
