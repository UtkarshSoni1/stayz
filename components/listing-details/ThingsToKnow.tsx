import type { ThingToKnow } from "@/types/listing-detail";

interface ThingsToKnowProps {
  items: ThingToKnow[];
}

export function ThingsToKnow({ items }: ThingsToKnowProps) {
  if (items.length === 0) return null;

  return (
    <section className="pb-10">
      <h3 className="font-headline-lg text-headline-lg text-white mb-8">Things to know</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.id}>
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-on-surface-variant text-2xl">
                {item.icon}
              </span>
              <h4 className="font-label-bold text-white uppercase tracking-wider text-sm">
                {item.title}
              </h4>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
