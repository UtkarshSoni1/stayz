interface MapSectionProps {
  location: string;
  imageUrl: string;
  imageAlt: string;
}

export function MapSection({ location, imageUrl, imageAlt }: MapSectionProps) {
  return (
    <section className="border-b border-outline-variant/30 pb-10 mb-10" id="location">
      <h3 className="font-headline-lg text-headline-lg text-white mb-2">Where you&apos;ll be</h3>
      <p className="text-on-surface-variant mb-6">{location}</p>
      {imageUrl ? (
        <div className="overflow-hidden rounded-2xl border border-outline-variant/30 hero-zoom">
          <img
            className="w-full h-[400px] object-cover transition-transform duration-700"
            src={imageUrl}
            alt={imageAlt}
          />
        </div>
      ) : (
        <div className="h-[400px] flex flex-col items-center justify-center rounded-2xl border border-outline-variant/30 bg-white/5 backdrop-blur-sm gap-4">
          <span className="material-symbols-outlined text-primary text-5xl">map</span>
          <p className="text-on-surface-variant text-sm">Map view is not available for this listing</p>
        </div>
      )}
    </section>
  );
}
