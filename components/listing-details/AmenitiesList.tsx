import type { Amenity } from "@/types/listing-detail";

interface AmenitiesListProps {
  highlights?: Amenity[];
  amenities?: Amenity[];
}

function AmenityCard({ amenity }: { amenity: Amenity }) {
  return (
    <div className="glass-card p-8 rounded-2xl flex gap-6 items-start border border-white/10">
      <span className="material-symbols-outlined text-primary text-4xl">{amenity.icon}</span>
      <div>
        <h3 className="font-label-bold text-lg text-white uppercase tracking-wider mb-2">
          {amenity.title}
        </h3>
        <p className="text-on-surface-variant">{amenity.description}</p>
      </div>
    </div>
  );
}

export function AmenitiesList({ highlights = [], amenities = [] }: AmenitiesListProps) {
  const hasHighlights = highlights.length > 0;
  const hasAmenities = amenities.length > 0;

  if (!hasHighlights && !hasAmenities) return null;

  return (
    <div className="space-y-10 mb-10">
      {hasHighlights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.map((item) => (
            <AmenityCard key={item.id} amenity={item} />
          ))}
        </div>
      )}
      {hasAmenities && (
        <div>
          <h3 className="font-headline-lg text-headline-lg text-white mb-6">
            What this place offers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {amenities.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 py-3 border-b border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-2xl">
                  {item.icon}
                </span>
                <span className="text-on-surface">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
