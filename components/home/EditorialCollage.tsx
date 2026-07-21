"use client"
import collageImg1 from "@/public/assets/images/collage-img1.png";
import collageImg2 from "@/public/assets/images/collage-img2.png";
import collageImg3 from "@/public/assets/images/collage-img3.png";
import collageImg4 from "@/public/assets/images/collage-img4.jpg";
import collageImg5 from "@/public/assets/images/collage-img5.png";
import collageImg6 from "@/public/assets/images/collage-img6.png";
import collageImg7 from "@/public/assets/images/collage-img7.png";
import collageImg8 from "@/public/assets/images/collage-img8.png";
import React, { useEffect, useRef } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
interface ScatteredImage {
  src: string;
  alt: string;
  className: string;
  rotate: number;
}

const collageImages: ScatteredImage[] = [
  { src: collageImg1.src, alt: "Cozy room", className: "w-64 h-80 top-[10%] left-[5%]", rotate: -6 },
  { src: collageImg2.src, alt: "Student working", className: "w-72 h-48 top-[15%] right-[8%]", rotate: 4 },
  { src: collageImg3.src, alt: "Rooftop view", className: "w-80 h-56 bottom-[12%] left-[10%]", rotate: -3 },
  { src: collageImg4.src, alt: "Kitchen area", className: "w-56 h-72 bottom-[20%] right-[5%]", rotate: 8 },
  { src: collageImg5.src, alt: "Unpacking", className: "w-48 h-64 top-[40%] left-[2%]", rotate: 12 },
  { src: collageImg6.src, alt: "Flatmates chilling", className: "w-64 h-48 bottom-[5%] right-[15%]", rotate: -2 },
  { src: collageImg7.src, alt: "Verified badge", className: "w-40 h-32 top-[5%] left-[30%]", rotate: 15 },
  { src: collageImg8.src, alt: "Street scene", className: "w-64 h-64 top-[60%] right-[10%]", rotate: -5 }
];

export const EditorialCollage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const images = containerRef.current.querySelectorAll<HTMLImageElement>(".scattered-image");
      const x = (window.innerWidth / 2 - e.pageX) / 50;
      const y = (window.innerHeight / 2 - e.pageY) / 50;

      images.forEach((img, i) => {
        const speed = (i + 1) * 0.2;
        const baseRotate = img.getAttribute("data-rotate") || "0";
        img.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${baseRotate}deg)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="mt-8 z-10 relative min-h-screen w-full pt-24 bg-surface-container-lowest flex items-center justify-center overflow-hidden">
      {collageImages.map((img, index) => (
        <img
          key={index}
          alt={img.alt}
          src={img.src}
          data-rotate={img.rotate}
          className={`absolute scattered-image rounded-xl object-cover z-1 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-out hover:scale-105 hover:!rotate-0 hover:z-20 ${img.className}`}
          style={{ transform: `rotate(${img.rotate}deg)` }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl px-[20px] pointer-events-none">
        <h1 className="text-white font-black text-[120px] leading-[110px] tracking-[-0.05em] mb-12 drop-shadow-sm">
          Where Every Journey Finds a Home
        </h1>
        <a className="inline-flex items-center gap-2 border-2 border-[#FFEDE7] px-10 py-4 rounded-full font-bold text-lg hover:bg-[#1A4FD1] hover:text-white transition-all duration-300 transform active:scale-95 text-white pointer-events-auto" href="/listings">
          Browse Listings <HiArrowNarrowRight className="text-3xl" />
        </a>
      </div>
    </section>
  );
};