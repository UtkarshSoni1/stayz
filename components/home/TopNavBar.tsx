import React from "react";

export const TopNavBar: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 no-border backdrop-blur-md bg-background/20 flex justify-between items-center px-[20px] md:px-[64px] py-[8px]">
      <div className="font-sans text-[32px] leading-[36px] md:text-[48px] md:leading-[52px] tracking-tighter text-primary-fixed font-extrabold">
        StayZ
      </div>
      <nav className="hidden md:flex items-center gap-[24px]">
        <a className="text-primary-fixed border-b border-primary-fixed pb-1 font-bold text-[14px] uppercase tracking-widest hover:opacity-80 transition-opacity active:scale-95 transform" href="#">
          Browse
        </a>
        <a className="text-primary hover:text-primary-fixed transition-colors font-bold text-[14px] uppercase tracking-widest hover:opacity-80 transition-opacity active:scale-95 transform" href="#">
          For Hosts
        </a>
        <a className="text-primary hover:text-primary-fixed transition-colors font-bold text-[14px] uppercase tracking-widest hover:opacity-80 transition-opacity active:scale-95 transform" href="#">
          How it Works
        </a>
        <button className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-bold text-[14px] uppercase tracking-widest hover:opacity-80 transition-all active:scale-95">
          Find a Room
        </button>
      </nav>
      <button className="md:hidden text-primary">
        <span className="material-symbols-outlined text-[32px]">menu</span>
      </button>
    </header>
  );
};