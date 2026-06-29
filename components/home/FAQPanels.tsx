"use client"
import React, { useState, useEffect } from "react";
import { BackgroundShapes } from "./BackgroundShapes";

export const FAQPanels: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    setIsDesktop(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const getTransformStyle = (index: number) => {
    if (hoveredIndex === null) return {};

    if (hoveredIndex === index) {
      return {
        transform: "scale(1.05)",
        zIndex: 50,
      };
    }

    if (isDesktop) {
      // Adjacent shapes slide away horizontally on desktop
      const shift = index < hoveredIndex ? -50 : 50;
      return {
        transform: `translateX(${shift}px)`,
      };
    } else {
      // Adjacent shapes slide away vertically on mobile
      const shift = index < hoveredIndex ? -35 : 35;
      return {
        transform: `translateY(${shift}px)`,
      };
    }
  };

  return (
    <section className="relative w-full bg-[#0a0a0a] py-20 md:py-32 overflow-hidden flex flex-col items-center justify-center">
      {/* Interactive Background Shapes */}
      <BackgroundShapes />

      {/* Overlapping Panels Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-[1440px] mx-auto px-4 md:px-12">
        
        {/* Panel 1: What is StayZ? (Blue Rectangle) */}
        <div
          onMouseEnter={() => setHoveredIndex(0)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={getTransformStyle(0)}
          className="group relative flex-none w-[340px] h-[340px] md:w-[460px] md:h-[460px] bg-[#609ab1] flex flex-col justify-start pt-12 md:pt-16 px-8 md:px-12 z-10 overflow-hidden transition-all duration-500 ease-out cursor-pointer"
        >
          <h2 className="font-sans text-[30px] md:text-[30px] leading-[36px] md:leading-[48px] font-extrabold text-white leading-tight">
            What is StayZ?
          </h2>
          <div className="opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden group-hover:mt-6 transition-all duration-300 ease-out">
            <p className="font-sans text-[15px] md:text-[18px] leading-[22px] md:leading-[28px] text-white/90 max-w-sm">
              A room-rental platform built for Indian Gen Z — students, interns, young pros. Find verified PGs, flats, and rooms near you.
            </p>
          </div>
        </div>

        {/* Panel 2: How is it different? (Yellow Circle) */}
        <div
          onMouseEnter={() => setHoveredIndex(1)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={getTransformStyle(1)}
          className="group relative flex-none w-[340px] h-[340px] md:w-[520px] md:h-[520px] bg-[#d6a94d] rounded-full flex flex-col items-center px-8 md:px-12 text-center -mt-[60px] md:-mt-0 md:-ml-[140px] z-20 overflow-hidden transition-all duration-500 ease-out cursor-pointer"
        >
          <h2 className="font-sans text-[18px] md:text-[30px] leading-[36px] md:leading-[48px] font-extrabold text-white leading-tight pt-40">
            How is it <br/> different?
          </h2>
          <div className="opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden group-hover:mt-6 transition-all duration-300 ease-out">
            <p className="font-sans text-[15px] md:text-[18px] leading-[22px] md:leading-[28px] text-white/90 max-w-xs">
              No brokers. No spam calls. Just photo-first listings, vibe tags, and instant wishlist — like Airbnb but built for India.
            </p>
          </div>
        </div>

        {/* Panel 3: Who can list a room? (Brown U-Shape) */}
        <div
          onMouseEnter={() => setHoveredIndex(2)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={getTransformStyle(2)}
          className="group relative flex-none w-[300px] h-[340px] md:w-[450px] md:h-[460px] bg-[#a35e5a] flex flex-col justify-start pt-12 md:pt-16 px-8 md:px-12 rounded-b-[150px] md:rounded-b-[220px] -mt-[60px] md:-mt-0 md:-ml-[140px] z-30 overflow-hidden transition-all duration-500 ease-out cursor-pointer"
        >
          <h2 className="font-sans text-[18px] md:text-[30px] leading-[36px] md:leading-[48px] font-extrabold text-white leading-tight">
            Who can list a <br/>room?
          </h2>
          <div className="opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden group-hover:mt-6 transition-all duration-300 ease-out">
            <p className="font-sans text-[15px] md:text-[18px] leading-[22px] md:leading-[28px] text-white/90 max-w-sm">
              Any verified host — PG owners, landlords, flatmates looking for someone. List in under 5 minutes.
            </p>
          </div>
        </div>

        {/* Panel 4: Is it free to use? (Green Rounded-TR) */}
        <div
          onMouseEnter={() => setHoveredIndex(3)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={getTransformStyle(3)}
          className="group relative flex-none w-[340px] h-[340px] md:w-[400px] md:h-[460px] bg-[#3fa887] flex flex-col justify-center px-8 md:px-16 rounded-tr-[170px] md:rounded-tr-[240px] -mt-[60px] md:-mt-0 md:-ml-[110px] z-30 overflow-hidden transition-all duration-500 ease-out cursor-pointer"
        >
          <h2 className="font-sans text-[18px] md:text-[30px] leading-[36px] md:leading-[48px] font-extrabold text-white leading-tight">
            Is it free to use?
          </h2>
          <div className="opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden group-hover:mt-6 transition-all duration-300 ease-out">
            <p className="font-sans text-[15px] md:text-[18px] leading-[22px] md:leading-[28px] text-white/90 max-w-md">
              Free to browse and wishlist. Hosts pay a small fee to list. No hidden charges, no broker cuts.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};