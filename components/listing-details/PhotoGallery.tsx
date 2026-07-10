import type { ListingPhoto } from "@/types/listing-detail";

interface PhotoGalleryProps {
  photos: ListingPhoto[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [hero, ...gridPhotos] = photos;

  if (!hero) return null;

  // Cap gridPhotos display at exactly 4
  const displayedPhotos = gridPhotos.slice(0, 4);

  // Build 4 cells (using photos or placeholders if fewer than 4 exist)
  const cells = Array.from({ length: 4 }, (_, i) => displayedPhotos[i] || null);

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full h-auto md:aspect-[16/7] mb-12">
      {/* Hero left (spans 2 cols, full height) */}
      <div className="md:col-span-2 overflow-hidden rounded-t-2xl md:rounded-t-none md:rounded-l-2xl relative hero-zoom group cursor-pointer border border-outline-variant/30 h-[250px] md:h-full">
        <img
          className="w-full h-full object-cover transition-transform duration-700"
          src={hero.src}
          alt={hero.alt}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Right side = 4 cells in a 2x2 grid */}
      <div className="md:col-span-2 grid grid-cols-2 grid-rows-2 gap-4 h-[250px] md:h-full">
        {cells.map((photo, index) => {
          // Define rounded corners for outer boundary
          let roundedClass = "";
          if (index === 0) {
            roundedClass = ""; // Top-Left of right grid (inner edge)
          } else if (index === 1) {
            roundedClass = "rounded-tr-2xl"; // Top-Right corner of gallery
          } else if (index === 2) {
            roundedClass = "rounded-bl-2xl md:rounded-none"; // Bottom-Left on mobile (gallery bottom), square on desktop (inner edge)
          } else if (index === 3) {
            roundedClass = "rounded-br-2xl"; // Bottom-Right corner of gallery
          }

          if (photo) {
            return (
              <div
                key={photo.src}
                className={`overflow-hidden border border-outline-variant/30 hero-zoom group cursor-pointer relative ${roundedClass}`}
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-700"
                  src={photo.src}
                  alt={photo.alt}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {index === 3 && (
                  <button
                    type="button"
                    className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white text-black px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-label-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl z-10"
                  >
                    <span className="material-symbols-outlined text-sm md:text-lg">grid_view</span>
                    Show all photos
                  </button>
                )}
              </div>
            );
          } else {
            // Render premium placeholder cell matching corner rounding
            return (
              <div
                key={`empty-${index}`}
                className={`bg-[#13151b] border border-outline-variant/10 flex flex-col items-center justify-center p-4 relative ${roundedClass}`}
              >
                <span className="material-symbols-outlined text-muted-foreground/20 text-xl md:text-2xl mb-1">
                  image_not_supported
                </span>
                <span className="text-[9px] md:text-[10px] text-muted-foreground/40 uppercase tracking-widest font-semibold">
                  StayZ Property
                </span>
                {index === 3 && (
                  <button
                    type="button"
                    className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white text-black px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-label-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl z-10"
                  >
                    <span className="material-symbols-outlined text-sm md:text-lg">grid_view</span>
                    Show all photos
                  </button>
                )}
              </div>
            );
          }
        })}
      </div>
    </section>
  );
}
