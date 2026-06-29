"use client"
import React, { useEffect, useRef } from "react";
import { TrendingCard } from "./TrendingCard";

export const Hero: React.FC = () => {
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      bgRef.current.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="relative h-screen w-full flex flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,19,19,0.4)] via-[rgba(19,19,19,0.2)] to-[rgba(19,19,19,0.9)] z-10" />
        <img
          ref={bgRef}
          alt="Cinematic night view of a modern urban apartment"
          className="w-full h-full object-cover grayscale-[20%] brightness-[0.7] transition-transform duration-100 ease-out"
          style={{ transform: "scale(1.1)" }}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyE2LJy8E3laFUOIxZKZegb4PPKrdrvjXLK33tjsjEiu1DpSChAEiszF7PMRhX4euNLdsQT0JucTnV3Kz1IswgXw4WewuEXnyBA9yCQU9s_cg5kmQZeHnJQfE7Xwtv1rcdveFYs4542j_H6N-_hervflcXq8PVUKkiCM9wRvd4gvOx-RKxamwAEcTx_E3lZN0zuWkIJEKNMqKHE23e55heT0ExdESASImsAqoZMhAiEmO2ZVE75Ko25h-f-6PCNBXZutvQgRgeQphR"
        />
      </div>

      <div className="relative z-20 w-full px-[20px] md:px-[64px] pb-24 md:pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-12">
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <h1 className="font-black text-[64px] leading-[60px] md:text-[120px] md:leading-[110px] md:tracking-[-0.05em] text-primary drop-shadow-2xl">
            Find your vibe.<br />
            <span className="text-primary-fixed">Find your place.</span>
          </h1>
        </div>
        <TrendingCard />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 md:flex hidden">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Explore More</span>
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-primary-fixed animate-[bounce_2s_infinite]" />
        </div>
      </div>
    </main>
  );
};