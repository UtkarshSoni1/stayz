"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Code2, 
  Layers, 
  Brain, 
  Server, 
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";

type TabType = "about" | "skills" | "projects" | "credentials";

function TypewriterEffect() {
  const phrases = [
    "Designing clean, aesthetic interfaces",
    "Next.js + Tailwind CSS developer",
    "Co-building StayZ room-rental platform",
    "Creating pixel-perfect responsive layouts"
  ];
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 20 : 40;
    
    if (!isDeleting && displayedText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(
          isDeleting
            ? currentPhrase.substring(0, displayedText.length - 1)
            : currentPhrase.substring(0, displayedText.length + 1)
        );
      }, typingSpeed);
    }
    
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhraseIndex]);

  return (
    <div className="min-h-[24px] flex items-center justify-center md:justify-start">
      <span className="font-mono text-xs sm:text-sm font-bold text-red-400">
        {displayedText}
      </span>
      <span className="w-1.5 h-4 bg-white ml-1 animate-pulse shrink-0" />
    </div>
  );
}

export default function DeveloperPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("about");

  const tabs = [
    { id: "about", label: "About & Journey", icon: GraduationCap },
    { id: "skills", label: "Tech Stack", icon: Code2 },
    { id: "projects", label: "Projects", icon: Layers },
    { id: "credentials", label: "Certifications", icon: Award },
  ];

  const stats = [
    { label: "B.Tech (IT-IOT)", value: "8.1 CGPA", desc: "MITS-DU, Gwalior", color: "border-white text-white" },
    { label: "Semester", value: "7th", desc: "Class of 2027", color: "border-white text-white" },
    { label: "Projects", value: "10+", desc: "Shipped & building", color: "border-white text-white" },
    { label: "Certifications", value: "2 Active", desc: "See credentials tab", color: "border-white text-white" }
  ];

  return (
    <div className="flex-1 w-full bg-[#11131b] text-white min-h-screen py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto flex flex-col relative z-10">
        
        {/* Top Layout: Profile (Left) + Stats (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Header Profile Section (Left) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-9 bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-6 sm:p-8 shadow-[8px_8px_0px_theme(colors.gray.500/10)] flex flex-col md:flex-row items-center gap-6 sm:gap-8 h-full hover:border-[#346ef6]/50 transition-colors duration-200"
          >
            {/* Avatar Area */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/10 rounded-full border-2 border-[#434655] flex flex-col items-center justify-center shadow-[4px_4px_0px_#00000040] shrink-0 hover:border-[#346ef6]/50 transition-colors duration-200">
              <span className="font-heading font-black text-2xl text-white mt-1">US</span>
              <span className="text-[10px] font-bold text-neutral-400 font-mono">DEVELOPER</span>
            </div>

            {/* User Meta */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 border-2 border-[#434655] shadow-[2px_2px_0px_theme(colors.gray.500/10)] rounded-sm mb-3 hover:border-[#346ef6]/50 transition-colors duration-200">
                <span className="text-[10px] font-black text-white uppercase tracking-widest mt-[1px]">
                  Building Web Apps · Exploring AI · Solving Problems
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
                Utkarsh Soni
              </h1>
              
              {/* Dynamic Typewriter effect */}
              <div className="mb-4">
                <TypewriterEffect />
              </div>

              {/* Social Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <a
                  href="www.linkedin.com/in/utkarsh-soni-6bb1b2322"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A66C2] text-white border-2 border-[#434655] rounded-md font-bold text-xs shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:translate-x-[1px] hover:translate-y-[1px] hover:border-[#346ef6]/50 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="https://github.com/utkarshsoni1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181717] text-white border-2 border-[#434655] rounded-md font-bold text-xs shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:translate-x-[1px] hover:translate-y-[1px] hover:border-[#346ef6]/50 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.22 0 4.61-2.807 5.62-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.22.694.825.576C20.566 21.797 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="mailto:utkarshsoni2222@gmial.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EA4335] text-white border-2 border-[#434655] rounded-md font-bold text-xs shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:translate-x-[1px] hover:translate-y-[1px] hover:border-[#346ef6]/50 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                >
                  <Mail size={14} /> Email
                </a>
                <a
                  href="https://utkarshsoni1.github.io/Resume/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4285F4] text-white border-2 border-[#434655] rounded-md font-bold text-xs shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:translate-x-[1px] hover:translate-y-[1px] hover:border-[#346ef6]/50 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                >
                  <FileText size={14} /> Resume
                </a>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid Banner (Right) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-3.5 h-full"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-3 text-center lg:text-left lg:flex lg:items-center lg:justify-between shadow-[4px_4px_0px_theme(colors.gray.500/10)] hover:-translate-y-0.5 hover:border-[#346ef6]/50 transition-all duration-200 h-full lg:px-4"
              >
                <div>
                  <div className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">{stat.label}</div>
                  <div className="text-base lg:text-lg font-extrabold text-white mt-1 font-heading leading-none">{stat.value}</div>
                </div>
                <div className="hidden lg:block text-[9px] font-bold text-neutral-300 max-w-[80px] text-right truncate whitespace-normal">
                  {stat.desc}
                </div>
                <div className="lg:hidden text-[9px] font-bold text-neutral-300 mt-0.5 truncate">{stat.desc}</div>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b-2 border-[#434655] mb-8 pb-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide transition-all duration-200 active:translate-x-[1px] active:translate-y-[1px] ${
                  isActive
                    ? "bg-[#346ef6] text-white border-[#346ef6] shadow-[2px_2px_0px_theme(colors.gray.500/10)]"
                    : "bg-[#1d1f28] border-[#434655] text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-[#346ef6]/50 shadow-[2px_2px_0px_theme(colors.gray.500/10)] active:shadow-[1px_1px_0px_#00000040]"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* About & Education */}
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Profile Card & Highlights (Left) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-5 shadow-[6px_6px_0px_theme(colors.gray.500/10)] hover:border-[#346ef6]/50 transition-colors duration-200">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider mb-3 border-b-2 border-[#434655] pb-2 flex items-center gap-2">
                      About Me
                    </h3>
                    <div className="text-xs sm:text-sm text-neutral-200 font-medium leading-relaxed">
                      <p>
                        I'm a B.Tech student who enjoys building things that solve real problems. Whether it's a full-stack web application, experimenting with AI, or exploring new technologies, I love turning ideas into projects that people can actually use. I primarily work with the MERN stack and continuously improve my problem-solving skills through Data Structures and Algorithms. When I'm not coding, you'll probably find me learning something new, refining my skills, or sketching anime and manga. My goal is simple: keep building, keep learning, and create software that makes a meaningful impact.

                      </p>
                    </div>
                    {/* Moto Blockquote */}
                    <div className="bg-[#1D1F28] border border-[#434655] shadow-[2px_2px_0px_theme(colors.gray.500/10)] p-3 rounded-lg my-4 relative overflow-hidden">
                      <div className="absolute right-0 top-0 bg-blue-600 text-white border-b border-l border-neutral-900 px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider uppercase">
                        MOTTO
                      </div>
                      <p className="italic font-heading text-sm font-black text-white leading-snug">
                        "Learning is my ritual. Coding is my craft. Building is my testimony."
                      </p>
                    </div>
                    {/* Highlights Bullet List */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="flex gap-2 items-start bg-neutral-800/40 border border-[#434655] p-2.5 rounded shadow-[1.5px_1.5px_0px_theme(colors.gray.500/10)] hover:border-[#346ef6]/50 transition-colors duration-200">
                        <Layers size={14} className="text-white mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-white text-[10px] uppercase tracking-wide">StayZ Platform</div>
                          <p className="text-[9px] text-neutral-300 font-semibold mt-0.5 leading-tight">Next.js 14, PostgreSQL, Prisma.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start bg-neutral-800/40 border border-[#434655] p-2.5 rounded shadow-[1.5px_1.5px_0px_theme(colors.gray.500/10)] hover:border-[#346ef6]/50 transition-colors duration-200">
                        <Code2 size={14} className="text-white mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-white text-[10px] uppercase tracking-wide">Ikigai4Teens</div>
                          <p className="text-[9px] text-neutral-300 font-semibold mt-0.5 leading-tight">Helping teens discover their strengths and future through AI.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start bg-neutral-800/40 border border-[#434655] p-2.5 rounded shadow-[1.5px_1.5px_0px_theme(colors.gray.500/10)] hover:border-[#346ef6]/50 transition-colors duration-200">
                        <Brain size={14} className="text-white mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-white text-[10px] uppercase tracking-wide">DraftSpace</div>
                          <p className="text-[9px] text-neutral-300 font-semibold mt-0.5 leading-tight">An AI-powered workspace for smarter note-taking and writing.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start bg-neutral-800/40 border border-[#434655] p-2.5 rounded shadow-[1.5px_1.5px_0px_theme(colors.gray.500/10)] hover:border-[#346ef6]/50 transition-colors duration-200">
                        <Server size={14} className="text-white mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-white text-[10px] uppercase tracking-wide">Shyne</div>
                          <p className="text-[9px] text-neutral-300 font-semibold mt-0.5 leading-tight">A modern e-commerce platform for a seamless shopping experience.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic History (Right) */}
                <div className="lg:col-span-5">
                  <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-5 shadow-[6px_6px_0px_theme(colors.gray.500/10)] h-full hover:border-[#346ef6]/50 transition-colors duration-200">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-b-2 border-[#434655] pb-2 flex items-center gap-2">
                      <GraduationCap size={18} /> Journey
                    </h3>
                    
                    <div className="relative border-l border-[#434655] ml-3 pl-4 space-y-4">
                      
                      {/* B.Tech */}
                      <div className="relative">
                        <div className="absolute w-2.5 h-2.5 bg-white border border-[#434655] rounded-full -left-[21.5px] top-1" />
                        <span className="text-[9px] font-mono font-bold bg-neutral-800 px-1.5 py-0.5 border border-[#434655] rounded inline-block mb-1">
                          2023 – 2027
                        </span>
                        <h4 className="font-bold text-white text-xs leading-tight">B.Tech – Computer Science</h4>
                        <p className="text-[10px] text-neutral-300 font-semibold mt-0.5">MITS-DU, Gwalior</p>
                        <div className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 bg-white/10 border border-[#434655]/50 rounded text-[9px] font-bold text-white">
                          CGPA: 8.4 / 10 · 7th Sem
                        </div>
                      </div>

                      {/* 12th */}
                      <div className="relative">
                        <div className="absolute w-2.5 h-2.5 bg-[#1d1f28] border border-[#434655] rounded-full -left-[21.5px] top-1" />
                        <span className="text-[9px] font-mono font-bold bg-neutral-800 px-1.5 py-0.5 border border-[#434655] rounded inline-block mb-1">
                          2023
                        </span>
                        <h4 className="font-bold text-white text-xs leading-tight">Class 12th</h4>
                        <div className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 bg-neutral-800 border border-[#434655] rounded text-[9px] font-bold text-neutral-300">
                          91%
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tech Stack */}
            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Languages & Frontend */}
                  <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-6 shadow-[6px_6px_0px_theme(colors.gray.500/10)] flex flex-col hover:border-[#346ef6]/50 transition-colors duration-200">
                    <h3 className="text-[14px] font-black text-blue-400 uppercase tracking-wider mb-4 border-b-2 border-[#434655] pb-2 flex items-center gap-2">
                      <Code2 size={18} className="text-blue-400" /> Languages & Frontend
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { name: "Java", desc: "Core & Backend", icon: "https://skillicons.dev/icons?i=java&theme=dark" },
                        { name: "TypeScript", desc: "Safety & Types", icon: "https://skillicons.dev/icons?i=ts&theme=dark" },
                        { name: "JavaScript", desc: "Interactivity", icon: "https://skillicons.dev/icons?i=js&theme=dark" },
                        { name: "React", desc: "Component UI", icon: "https://skillicons.dev/icons?i=react&theme=dark" },
                        { name: "Vite", desc: "Build Tool", icon: "https://skillicons.dev/icons?i=vite&theme=dark" },
                        { name: "Next.js 14", desc: "App Router", icon: "https://skillicons.dev/icons?i=nextjs&theme=dark" },
                        { name: "Tailwind CSS", desc: "Utility Styling", icon: "https://skillicons.dev/icons?i=tailwind&theme=dark" },
                        { name: "HTML", desc: "Structure", icon: "https://skillicons.dev/icons?i=html&theme=dark" },
                        { name: "CSS", desc: "Layout & Styling", icon: "https://skillicons.dev/icons?i=css&theme=dark" },
                        { name: "shadcn/ui", desc: "Component Library" },
                        { name: "Framer Motion", desc: "Animation" }
                      ].map((item) => (
                        <div 
                          key={item.name} 
                          className="flex items-center justify-between px-3 py-2 bg-[#1d1f28] border-2 border-[#434655] rounded-lg shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:-translate-y-0.5 hover:border-[#346ef6]/50 hover:shadow-[3px_3px_0px_#ffffff] hover:bg-neutral-800 transition-all duration-200 select-none w-full sm:w-[calc(50%-4px)] lg:w-full"
                        >
                          <div className="flex flex-col">
                            <span className="font-extrabold text-white text-xs">{item.name}</span>
                            <span className="text-[9px] text-neutral-300 font-bold leading-none mt-0.5">{item.desc}</span>
                          </div>
                          {item.icon && (
                            <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Backend & Database */}
                  <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-6 shadow-[6px_6px_0px_theme(colors.gray.500/10)] flex flex-col hover:border-[#346ef6]/50 transition-colors duration-200">
                    <h3 className="text-[14px] font-black text-green-400 uppercase tracking-wider mb-4 border-b-2 border-[#434655] pb-2 flex items-center gap-2">
                      <Server size={18} className="text-green-400" /> Backend & Database
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { name: "Java", desc: "Core Backend", icon: "https://skillicons.dev/icons?i=java&theme=dark" },
                        { name: "Node.js", desc: "Runtime", icon: "https://skillicons.dev/icons?i=nodejs&theme=dark" },
                        { name: "Express", desc: "API Layer", icon: "https://skillicons.dev/icons?i=express&theme=dark" },
                        { name: "REST API", desc: "Endpoints", icon: "/assets/icons/REST.svg" },
                        { name: "PostgreSQL", desc: "Relational Database", icon: "https://skillicons.dev/icons?i=postgres&theme=dark" },
                        { name: "MySQL", desc: "Relational Database", icon: "https://skillicons.dev/icons?i=mysql&theme=dark" },
                        { name: "MongoDB", desc: "Document Storage", icon: "https://skillicons.dev/icons?i=mongodb&theme=dark" },
                        { name: "Prisma", desc: "ORM & Migrations", icon: "https://skillicons.dev/icons?i=prisma&theme=dark" },
                        { name: "JWT", desc: "Secure Tokens", icon: "/assets/icons/JWT.svg" },
                        { name: "Gradle", desc: "Build Tool", icon: "https://skillicons.dev/icons?i=gradle&theme=dark" },
                        { name: "Socket.io", desc: "Realtime Sync", icon: "https://skillicons.dev/icons?i=socketio&theme=dark" },
                        { name: "Auth.js", desc: "Authentication" }
                      ].map((item) => (
                        <div 
                          key={item.name} 
                          className="flex items-center justify-between px-3 py-2 bg-[#1d1f28] border-2 border-[#434655] rounded-lg shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:-translate-y-0.5 hover:border-[#346ef6]/50 hover:shadow-[3px_3px_0px_#ffffff] hover:bg-neutral-800 transition-all duration-200 select-none w-full sm:w-[calc(50%-4px)] lg:w-full"
                        >
                          <div className="flex flex-col">
                            <span className="font-extrabold text-white text-xs">{item.name}</span>
                            <span className="text-[9px] text-neutral-300 font-bold leading-none mt-0.5">{item.desc}</span>
                          </div>
                          {item.icon && (
                            <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Design & UI/UX */}
                  <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-6 shadow-[6px_6px_0px_theme(colors.gray.500/10)] flex flex-col hover:border-[#346ef6]/50 transition-colors duration-200">
                    <h3 className="text-[14px] font-black text-purple-400 uppercase tracking-wider mb-4 border-b-2 border-[#434655] pb-2 flex items-center gap-2">
                      <Brain size={18} className="text-purple-400" /> Design & UI/UX
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { name: "Figma", desc: "Design Systems", icon: "https://skillicons.dev/icons?i=figma&theme=dark" },
                        { name: "Adobe Illustrator", desc: "Asset Creation", icon: "https://skillicons.dev/icons?i=ai&theme=dark" },
                        { name: "Wireframing", desc: "UX Blueprinting" },
                        { name: "Prototyping", desc: "Interactive Demos" },
                        { name: "Design Tokens", desc: "Theme variables" },
                        { name: "OKLCH Colors", desc: "Modern Palette" }
                      ].map((item) => (
                        <div 
                          key={item.name} 
                          className="flex items-center justify-between px-3 py-2 bg-[#1d1f28] border-2 border-[#434655] rounded-lg shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:-translate-y-0.5 hover:border-[#346ef6]/50 hover:shadow-[3px_3px_0px_#ffffff] hover:bg-neutral-800 transition-all duration-200 select-none w-full sm:w-[calc(50%-4px)] lg:w-full"
                        >
                          <div className="flex flex-col">
                            <span className="font-extrabold text-white text-xs">{item.name}</span>
                            <span className="text-[9px] text-neutral-300 font-bold leading-none mt-0.5">{item.desc}</span>
                          </div>
                          {item.icon && (
                            <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DevOps & Tools */}
                  <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-6 shadow-[6px_6px_0px_theme(colors.gray.500/10)] flex flex-col hover:border-[#346ef6]/50 transition-colors duration-200">
                    <h3 className="text-[14px] font-black text-red-400 uppercase tracking-wider mb-4 border-b-2 border-[#434655] pb-2 flex items-center gap-2">
                      <Code2 size={18} className="text-red-400" /> DevOps & Tools
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        { name: "Git", desc: "Version Control", icon: "https://skillicons.dev/icons?i=git&theme=dark" },
                        { name: "GitHub", desc: "Collaboration", icon: "https://skillicons.dev/icons?i=github&theme=dark" },
                        { name: "VS Code", desc: "Primary IDE", icon: "https://skillicons.dev/icons?i=vscode&theme=dark" },
                        { name: "Docker", desc: "Containerization", icon: "https://skillicons.dev/icons?i=docker&theme=dark" },
                        { name: "GitHub Actions", desc: "CI/CD Pipeline", icon: "https://skillicons.dev/icons?i=githubactions&theme=dark" },
                        { name: "Electron", desc: "Desktop Apps", icon: "https://skillicons.dev/icons?i=electron&theme=dark" },
                        { name: "Linux", desc: "OS Environment", icon: "https://skillicons.dev/icons?i=linux&theme=dark" },
                        { name: "Vercel", desc: "Cloud Hosting", icon: "https://skillicons.dev/icons?i=vercel&theme=dark" },
                        { name: "Render", desc: "Cloud Hosting", icon: "/assets/icons/Render.svg" },
                        { name: "Linting", desc: "ESLint & Rules" },
                        { name: "Package Managers", desc: "npm & bun" }
                      ].map((item) => (
                        <div 
                          key={item.name} 
                          className="flex items-center justify-between px-3 py-2 bg-[#1d1f28] border-2 border-[#434655] rounded-lg shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:-translate-y-0.5 hover:border-[#346ef6]/50 hover:shadow-[3px_3px_0px_#ffffff] hover:bg-neutral-800 transition-all duration-200 select-none w-full sm:w-[calc(50%-4px)] lg:w-full"
                        >
                          <div className="flex flex-col">
                            <span className="font-extrabold text-white text-xs">{item.name}</span>
                            <span className="text-[9px] text-neutral-300 font-bold leading-none mt-0.5">{item.desc}</span>
                          </div>
                          {item.icon && (
                            <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Footer Callout */}
                <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-5 shadow-[4px_4px_0px_theme(colors.gray.500/10)] flex items-center gap-3 hover:border-[#346ef6]/50 transition-colors duration-200">
                  <Code2 size={20} className="text-white shrink-0" />
                  <p className="text-xs text-neutral-300 font-bold leading-relaxed">
                    Passionate about clean code and beautiful pixels. Bridging the gap between front-end implementation and premium UI/UX design.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Projects */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* StayZ */}
                  <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-6 shadow-[6px_6px_0px_theme(colors.gray.500/10)] flex flex-col justify-between relative overflow-hidden hover:-translate-y-0.5 hover:border-[#346ef6]/50 transition-all duration-200">
                    <div className="absolute right-0 top-0 bg-red-600 text-white border-b-2 border-l-2 border-[#434655] px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                      Active
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        StayZ — Room Rentals
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-extrabold font-mono tracking-tight mb-4 uppercase">
                        Next.js 14 · PostgreSQL · Prisma · Auth.js
                      </p>
                      <p className="text-xs text-neutral-300 font-medium mb-4 leading-relaxed">
                        A Gen Z-focused room-rental platform, co-built with a small team using a feature-based full-stack ownership model instead of a frontend/backend split.
                      </p>
                      <ul className="text-[11px] text-neutral-400 font-semibold space-y-1.5 mb-6">
                        <li className="flex items-start gap-1.5">
                          <span className="text-success text-xs mt-0.5">•</span>
                          <span>Airbnb-style listings with wishlist and auth-aware dashboard.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-success text-xs mt-0.5">•</span>
                          <span>Prisma schema built on top of Auth.js models.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-success text-xs mt-0.5">•</span>
                          <span>Dedicated /developers section for the team, this page included.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <a
                        href="https://github.com/UtkarshSoni1/stayz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 text-white border-2 border-[#434655] rounded-md font-bold text-[11px] shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:translate-x-[1px] hover:translate-y-[1px] hover:border-[#346ef6]/50 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                      >
                        View Repository <ExternalLink size={12} />
                      </a>
                      <a
                        href="/"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#346ef6] text-white border-2 border-[#346ef6] rounded-md font-bold text-[11px] shadow-[2px_2px_0px_#00000040] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#346ef6]/90 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                      >
                        Live Demo <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* DraftSpace */}
                  <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-6 shadow-[6px_6px_0px_theme(colors.gray.500/10)] flex flex-col justify-between relative overflow-hidden hover:-translate-y-0.5 hover:border-[#346ef6]/50 transition-all duration-200">
                    <div className="absolute right-0 top-0 bg-green-600 text-white border-b-2 border-l-2 border-[#434655] px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                      Shipped
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        DraftSpace
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-extrabold font-mono tracking-tight mb-4 uppercase">
                        Next.js · Socket.io · Gemini/Claude API · MongoDB
                      </p>
                      <p className="text-xs text-neutral-300 font-medium mb-4 leading-relaxed">
                        AI-powered collaborative design tool combining Excalidraw with Gemini for AI-assisted diagramming and real-time collaboration.
                      </p>
                      <ul className="text-[11px] text-neutral-400 font-semibold space-y-1.5 mb-6">
                        <li className="flex items-start gap-1.5">
                          <span className="text-white text-xs mt-0.5">•</span>
                          <span>NextAuth.js auth, Tailwind + shadcn/ui interface.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-white text-xs mt-0.5">•</span>
                          <span>Cut socket traffic by ~95% with 80ms event throttling on a custom Node.js + Socket.io real-time sync layer.  .</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-white text-xs mt-0.5">•</span>
                          <span>Deployed on Render with Google OAuth, per-IP rate limiting on AI routes, and auto-save.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <a
                        href="https://github.com/UtkarshSoni1/draftspace"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 text-white border-2 border-[#434655] rounded-md font-bold text-[11px] shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:translate-x-[1px] hover:translate-y-[1px] hover:border-[#346ef6]/50 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                      >
                        View Repository <ExternalLink size={12} />
                      </a>
                      <a
                        href="https://draftspace.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#346ef6] text-white border-2 border-[#346ef6] rounded-md font-bold text-[11px] shadow-[2px_2px_0px_#00000040] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#346ef6]/90 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                      >
                        Live Demo <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Ikigai4Teens */}
                  <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-6 shadow-[6px_6px_0px_theme(colors.gray.500/10)] flex flex-col justify-between relative overflow-hidden hover:-translate-y-0.5 hover:border-[#346ef6]/50 transition-all duration-200">
                    <div className="absolute right-0 top-0 bg-green-600 text-white border-b-2 border-l-2 border-[#434655] px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                      Shipped
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        Ikigai4Teens
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-extrabold font-mono tracking-tight mb-4 uppercase">
                        React · Tailwind CSS · Framer Motion
                      </p>
                      <p className="text-xs text-neutral-300 font-medium mb-4 leading-relaxed">
                        Built a MERN app where teens answer a 4-part questionnaire and get their Ikigai mapped out in a live SVG diagram — no page reload, results update as they go. 
                      </p>
                      <ul className="text-[11px] text-neutral-400 font-semibold space-y-1.5 mb-6">
                        <li className="flex items-start gap-1.5">
                          <span className="text-white text-xs mt-0.5">•</span>
                          <span>Integrated AI-powered career recommendations across three categories, cutting research time by ~70%.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-white text-xs mt-0.5">•</span>
                          <span>Implemented Express.js APIs and MongoDB persistence for seamless questionnaire resume functionality.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <a
                        href="https://github.com/UtkarshSoni1/Ikigai4Teens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 text-white border-2 border-[#434655] rounded-md font-bold text-[11px] shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:translate-x-[1px] hover:translate-y-[1px] hover:border-[#346ef6]/50 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                      >
                        View Repository <ExternalLink size={12} />
                      </a>
                      <a
                        href="/listings"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#346ef6] text-white border-2 border-[#346ef6] rounded-md font-bold text-[11px] shadow-[2px_2px_0px_#00000040] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#346ef6]/90 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                      >
                        Live Demo <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Shyne */}
                  <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-6 shadow-[6px_6px_0px_theme(colors.gray.500/10)] flex flex-col justify-between relative overflow-hidden hover:-translate-y-0.5 hover:border-[#346ef6]/50 transition-all duration-200">
                    <div className="absolute right-0 top-0 bg-blue-600 text-white border-b-2 border-l-2 border-[#434655] px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase">
                      Shipped
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        Shyne
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-extrabold font-mono tracking-tight mb-4 uppercase">
                        EJS · Node.js/Express.js · Tailwind CSS
                      </p>
                      <p className="text-xs text-neutral-300 font-medium mb-4 leading-relaxed">
                        Built a full-stack e-commerce platform using EJS, Node.js, Express.js, and Tailwind CSS.
                      </p>
                      <ul className="text-[11px] text-neutral-400 font-semibold space-y-1.5 mb-6">
                        <li className="flex items-start gap-1.5">
                          <span className="text-white text-xs mt-0.5">•</span>
                          <span>Implemented authentication, product management, and cart functionality.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-white text-xs mt-0.5">•</span>
                          <span>Developed responsive UI with RESTful APIs and MongoDB integration.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <a
                        href="https://github.com/UtkarshSoni1/shyne"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 text-white border-2 border-[#434655] rounded-md font-bold text-[11px] shadow-[2px_2px_0px_theme(colors.gray.500/10)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_theme(colors.gray.500/10)] transition-all"
                      >
                        View Repository <ExternalLink size={12} />
                      </a>
                      <a
                        href="https://nlp-chatbot-ui.streamlit.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#346ef6] text-white border-2 border-[#346ef6] rounded-md font-bold text-[11px] shadow-[2px_2px_0px_#00000040] hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#346ef6]/90 hover:shadow-[1px_1px_0px_#00000040] transition-all duration-200"
                      >
                        Live Demo <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* Certifications */}
            {activeTab === "credentials" && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="bg-[#1d1f28] border-2 border-[#434655] rounded-xl p-6 shadow-[6px_6px_0px_theme(colors.gray.500/10)] hover:border-[#346ef6]/50 transition-colors duration-200">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 border-b-2 border-[#434655] pb-2 flex items-center gap-2">
                    <Award size={20} /> Certifications
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Cert 1 */}
                    <div className="bg-neutral-800/30 border-2 border-[#434655] p-5 rounded-lg shadow-[3px_3px_0px_theme(colors.gray.500/10)] flex flex-col justify-between hover:-translate-y-0.5 hover:border-[#346ef6]/50 transition-all">
                      <div>
                        <div className="w-10 h-10 rounded bg-[#4285F4]/10 border border-[#4285F4]/30 flex items-center justify-center mb-4 p-1">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="w-full h-full object-contain" />
                        </div>
                        <h4 className="font-bold text-white text-sm leading-tight">Solution Architecture job Simulation – AWS (2025)</h4>
                        <p className="text-[10px] text-neutral-300 font-extrabold mt-1">Issued by — AWS [Forage]</p>
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <span className="text-[9px] font-bold font-mono bg-neutral-800 border border-[#434655] rounded px-1.5 py-0.5 text-neutral-300">2025</span>
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">Cloud</span>
                      </div>
                    </div>

                    {/* Cert 2 */}
                    <div className="bg-neutral-800/30 border-2 border-[#434655] p-5 rounded-lg shadow-[3px_3px_0px_theme(colors.gray.500/10)] flex flex-col justify-between hover:-translate-y-0.5 hover:border-[#346ef6]/50 transition-all duration-200">
                      <div>
                        <div className="w-12 h-12 rounded bg-[#4285F4]/10 border border-[#4285F4]/30 flex items-center justify-center mb-4 p-1">
                          <img src="https://www.nvidia.com/content/nvidiaGDC/in/en_IN/about-nvidia/legal-info/logo-brand-usage/_jcr_content/root/responsivegrid/nv_container_392921705/nv_container/nv_image.coreimg.svg/1776077817820/nvidia-logo-vert.svg" alt="NVIDIA" className="w-full h-full " />
                        </div>
                        <h4 className="font-bold text-white text-sm leading-tight">Deep Learning Fundamentals – Nvidia (2024)</h4>
                        <p className="text-[10px] text-neutral-300 font-extrabold mt-1">Issued by — Nvidia</p>
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <span className="text-[9px] font-bold font-mono bg-neutral-800 border border-[#434655] rounded px-1.5 py-0.5 text-neutral-300">2024</span>
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">AI</span>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex justify-center mt-10"
        >
          <Button variant="secondary" size="lg" onClick={() => router.push("/")} className="px-8 shadow-[4px_4px_0px_theme(colors.gray.500/10)] bg-[#1d1f28] border-2 border-[#434655] text-white hover:bg-neutral-800 hover:border-[#346ef6]/50 transition-all duration-200">
            ← Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}