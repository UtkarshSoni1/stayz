import React, { useEffect, useRef } from "react";

export const BackgroundShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const shapes = containerRef.current.querySelectorAll<HTMLDivElement>(".floating-shape");
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      shapes.forEach((shape, index) => {
        const depth = (index + 1) * 10;
        const moveX = (x - 0.5) * depth;
        const moveY = (y - 0.5) * depth;
        const hasRotate = shape.classList.contains("rotate-45");
        shape.style.transform = `translate(${moveX}px, ${moveY}px) ${hasRotate ? "rotate(45deg)" : ""}`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="floating-shape absolute bottom-[-40px] left-[5%] w-32 h-40 bg-[#e36d4a] rounded-t-full opacity-90 animate-pulse" />
      <div className="floating-shape absolute top-10 left-[40%] w-24 h-24 bg-[#8b8b6e] rounded-full opacity-90" />
      <div className="floating-shape absolute top-[5%] right-[35%] w-16 h-16 flex items-center justify-center">
        <div className="absolute w-full h-4 bg-[#d099d4] rotate-45 rounded-full" />
        <div className="absolute w-full h-4 bg-[#d099d4] -rotate-45 rounded-full" />
      </div>
      <div className="floating-shape absolute bottom-10 left-[55%] w-16 h-16 bg-[#689bb3] rotate-45 opacity-90" />
      <div className="floating-shape absolute bottom-[5%] right-[5%] w-24 h-24 bg-[#d9af59] flex items-center justify-center rounded-sm">
        <div className="w-8 h-8 bg-white rounded-full" />
      </div>
    </div>
  );
};