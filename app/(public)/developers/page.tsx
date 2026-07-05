"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Code2, ArrowRight, Layers, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DevelopersPage() {
  const router = useRouter();
  const [hoveredPanel, setHoveredPanel] = useState<"utkarsh" | "raj" | null>(null);

  const developers = [
    {
      id: "utkarsh" as const,
      name: "Utkarsh Soni",
      role: "Full Stack Developer & Aspiring ML Engineer",
      initials: "US",
      route: "/developers/utkarsh",
      college: "MITS-DU | Gwalior",
      description: "Focuses on end-to-end full stack features, Next.js architecture, and machine learning fundamentals.",
      tech: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "Prisma", "Python"],
      contributions: [
        "Homepage",
        "Listings Page",
        "Listing Details Page v2",
        "Developers Page",
        "Developers/Raj Page",
        "Developers/Utkarsh Page",
      ],
      color: "border-[#4285F4]",
    },
    {
      id: "raj" as const,
      name: "Raj Kewat",
      role: "Full Stack Developer & UI/UX Specialist",
      initials: "RK",
      route: "/developers/raj",
      college: "UIT RGPV | Shivpuri",
      description: "Bridges front-end implementation with high-contrast UI/UX design, custom animations, and interactive design systems.",
      tech: ["Next.js", "Figma", "Tailwind CSS", "Framer Motion", "Socket.io", "MongoDB"],
      contributions: [
        "Login / Sign-Up",
        "Listing Details Page v1",
        "User & Owner Dashboard",
        "Admin Panel",
      ],
      color: "border-[#34A853]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#131313] text-white py-8 px-4 sm:px-8 relative overflow-hidden flex flex-col justify-between">
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />

      {/* Header section */}
      <header className="max-w-7xl mx-auto w-full text-center mb-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border-2 border-white shadow-[3px_3px_0px_theme(colors.gray.500/10)] rounded-sm mb-4"
        >
          <span className="text-[10px] font-black text-white uppercase tracking-widest mt-[1px]">
            StayZ Team
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-4"
        >
          MEET THE DEVELOPERS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-neutral-400 max-w-xl mx-auto text-xs sm:text-sm font-medium"
        >
          The minds behind the StayZ Gen Z room-rental platform. Hover or tap each panel to explore their detailed credentials, tech stacks, and portfolios.
        </motion.p>
      </header>

      {/* Main Panels Section */}
      <main className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 relative z-10 my-4 justify-center items-stretch min-h-[450px]">
        {developers.map((dev) => {
          const isHovered = hoveredPanel === dev.id;
          const isAnyHovered = hoveredPanel !== null;
          
          return (
            <motion.div
              key={dev.id}
              onMouseEnter={() => setHoveredPanel(dev.id)}
              onMouseLeave={() => setHoveredPanel(null)}
              onClick={() => router.push(dev.route)}
              className={`flex-1 cursor-pointer bg-neutral-900 border-2 border-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-500 ease-in-out shadow-[8px_8px_0px_theme(color.gray.500/10)] hover:shadow-[12px_12px_0px_theme(color.gray.500/10)] hover:-translate-x-1 hover:-translate-y-1 ${
                isAnyHovered
                  ? isHovered
                    ? "md:flex-[1.4] bg-neutral-850"
                    : "md:flex-[0.8] opacity-60"
                  : "md:flex-[1]"
              }`}
              layout
            >
              {/* Dynamic decorative backdrop shape */}
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none transition-all duration-500 ease-in-out group-hover:scale-110" />

              <div>
                {/* Developer Avatar Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 rounded-full border-2 border-white bg-neutral-800 flex items-center justify-center shadow-[4px_4px_0px_#000000]">
                    <span className="font-heading font-black text-xl text-white">{dev.initials}</span>
                  </div>
                  
                  <div className="px-3 py-2 border border-neutral-700 bg-neutral-950 text-[10px] font-mono font-bold rounded text-neutral-400">
                    {dev.college}
                  </div>
                </div>

                {/* Info */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
                  {dev.name}
                </h2>
                
                <p className="text-xs font-mono font-bold text-neutral-400 mb-4 uppercase tracking-wider">
                  {dev.role}
                </p>

                <p className="text-neutral-300 text-xs sm:text-sm font-medium mb-6 leading-relaxed">
                  {dev.description}
                </p>

                {/* Contributions list */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2">Pages & Features Built</h4>
                  <ul className="space-y-1.5">
                    {dev.contributions.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-xs font-medium text-neutral-300"
                      >
                        <CheckCircle2 size={13} className="text-neutral-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech stack pills */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-2">Core Tech Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {dev.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold font-mono px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">
                  Explore Profile
                </span>
                <div className="w-10 h-10 rounded-lg border-2 border-white bg-white text-black flex items-center justify-center shadow-[2px_2px_0px_#000000] hover:bg-neutral-200 transition-colors shrink-0">
                  <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </main>

      {/* Footer controls */}
      <footer className="max-w-7xl mx-auto w-full flex justify-center mt-8 relative z-20">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => router.push("/")}
          className="px-8 shadow-[4px_4px_0px_#000000] bg-neutral-900 border-2 border-white text-white hover:bg-neutral-850"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Button>
      </footer>
    </div>
  );
}