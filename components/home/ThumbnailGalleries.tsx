import React, { useEffect, useRef } from "react";

interface ImageItem {
  src: string;
  alt: string;
}

const images: ImageItem[] = [
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuACi-vAixxYcaHfJOjSXVnCAal1rdSRvIDzQYKgsPmwSASQQW28UW9HH--XyUy4RZ5oZbJOMfrLh8bhZ-dq4AgXqyx-3fxRrBwMoOIktQNpPf31hFeSKSpvlo6tXm599cfEGTu6Dsq67JgR5j_LoxLkwEf7E04ftuGPgwM2reFiH5JQDzaxDIEY3MKO2SkLvtfX25Wvc5U8ZfbhVFOuqcQZy51ksYNJHUtRHxyv9H-Vs1iGY3jVmjArj9XlFW4buWW7XVo88ihxJHy6", alt: "Cozy common area lounge with plants and warm lighting" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZiCRDBW_K7Yg3R-qKU6P-1GbldNUfUviFqjqhZfwuMDATCNwGtQdyjBFKX-6NAEe5JPsw-xpI5oOaMoPptul7I3A8E3rwd1HodT8jTq0LhN-oJzJuPFaXy3SOVWkVnrRJeBaU667cKm3MBNJCueRxFKIFZOnwfhWVBa2U2r_G8Wt3dVTkAnN1yX9MoOCktU7GNaUkglyr7ONA9J6C1ueq-CrLqfHlIy8f1fxySWlxbZ8Nmf25NhYaEUve65Xo5vGntrw_nxBfbg3d", alt: "Rooftop view of a city at sunset with aesthetic seating" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjeZIOqFGfX0mWGdv_jxps7cITjxwfRVINkaX0kxRmMk_ZHbD-4KJCW7k7jSxuIA_SxPx2MjTS1sPiwgWDkynToXvcuSEzrCQmODP2ES-zzxY6AtG6wr-VEdWa4uCny_eHOnmtKuW6acDGq_3etPkxA9T8zs3pwusZQYF116Fff4irfNC3YOi7LuzCKwaV723QjdwWxs66ASeDO4d1Xj1JyUe9dEnzSiteqWpDM3Kfxs0BbcJGowjKZ6TQhYvu6moRsoorNEEO105i", alt: "Aesthetic student room with fairy lights and modern interior" },
  { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDez53PVRyCN_-xzMQ3dbN_x1lIMec2aX7g7rHWz568POIjgbU1NJ96s5XOIt6PVbsER51jdGYpwQJqf7ATSUhYTLBJFGGXANaKmuG74knYsK5ZI8J7nD8soG_-0D1OLxjRR-bhzEmREgMWvIrFaaVPUA1iNP3ujVjw8MPhvq2vG_jjt6WvusIPEYEn4lFqyX0NmWUDJwuN0qDDjMm2inlNJDvzAn-pKvoIB40hKjZ8S8HBT3l7h_vw9NjRfzxubjmnuNx0p4n3CsS5", alt: "Interior of a modern PG room with minimalist decor and soft light" }
];

export const ThumbnailGalleries: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll<HTMLDivElement>(".cinematic-fade");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index") || 0);
            setTimeout(() => {
              (entry.target as HTMLDivElement).style.transform = "translateY(0)";
              (entry.target as HTMLDivElement).style.opacity = "1";
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mt-[160px] w-screen -mx-[20px] md:-mx-[64px]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 h-[300px] md:h-[400px] items-end translate-y-12">
        {images.map((img, index) => (
          <div
            key={index}
            data-index={index}
            className="cinematic-fade h-full overflow-hidden rounded-t-lg group"
            style={{
              maskImage: "linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0.3) 100%)",
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 40%, rgba(0,0,0,0.3) 100%)",
              transform: "translateY(50px)",
              opacity: 0,
              transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)"
            }}
          >
            <img
              alt={img.alt}
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700 opacity-60 hover:opacity-100"
              src={img.src}
            />
          </div>
        ))}
      </div>
    </div>
  );
};