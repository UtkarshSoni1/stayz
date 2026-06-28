"use client"
import React, { useEffect, useRef } from "react";
import { ThumbnailGalleries } from "./ThumbnailGalleries";

export const Mission: React.FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headingRef.current) return;
      const scrolled = window.scrollY;
      //   headingRef.current.style.transform = `translateY(${scrolled * 0.1}px)`;
      headingRef.current.style.transform = `translateY(${Math.max(0, (scrolled - 100) * 0.08)}px)`;
      headingRef.current.style.opacity = `${Math.max(0, 1 - (scrolled - 600) / 1000)}`;
      // headingRef.current.style.opacity = `${1 - scrolled / 800}`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen flex flex-col justify-center relative overflow-hidden px-[20px] md:px-[64px] pt-32">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" />
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-[24px] w-full">
        <div className="hidden md:block md:col-span-5" />
        <div className="md:col-span-7 flex flex-col items-start text-left">
          <h1
            ref={headingRef}
            className="text-[48px] md:text-[80px] md:leading-[80px] font-extrabold text-white leading-[1] mb-12 max-w-[900px]"
          >
            We build room rentals<br />
            for the generation that<br />
            refuses to settle.<br />
            <span className="text-outline">No brokers. No BS.</span><br />
            Just your vibe, your place.
          </h1>
          <a
            className="inline-flex items-center justify-center mt-10 border-2 border-white text-white font-bold text-[14px] uppercase tracking-widest px-10 py-5 rounded-full hover:bg-white hover:text-black transition-all active:scale-95 group"
            href="#explore"
          >
            Explore StayZ 
            <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">
              --?
            </span>
          </a>
        </div>
      </div>
      <ThumbnailGalleries />
    </main>
  );
};