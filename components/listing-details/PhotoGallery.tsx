import type { ListingPhoto } from "@/types/listing-detail";

interface PhotoGalleryProps {
  photos: ListingPhoto[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [hero, ...gridPhotos] = photos;

  if (!hero) return null;

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px] mb-12">
      <div className="md:col-span-2 overflow-hidden rounded-2xl relative hero-zoom group cursor-pointer border border-outline-variant/30">
        <img
          className="w-full h-full object-cover transition-transform duration-700"
          src={hero.src}
          alt={hero.alt}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="md:col-span-2 grid grid-cols-2 gap-4 h-full">
        {gridPhotos.map((photo, index) => {
          const isLast = index === gridPhotos.length - 1;

          return (
            <div
              key={photo.src}
              className={`overflow-hidden rounded-2xl border border-outline-variant/30 hero-zoom group cursor-pointer ${
                isLast ? "relative" : ""
              }`}
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700"
                src={photo.src}
                alt={photo.alt}
              />
              {isLast && (
                <button
                  type="button"
                  className="absolute bottom-6 right-6 bg-white text-black px-6 py-2 rounded-full font-label-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  <span className="material-symbols-outlined text-lg">grid_view</span>
                  Show all photos
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
