import React from "react";

export const Stats: React.FC = () => {
  return (
    <section className="bg-surface py-[160px] px-[64px]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-[24px]">
        <div className="border-l border-outline-variant pl-8 py-4">
          <div className="text-[80px] leading-[80px] font-extrabold text-primary">50k+</div>
          <div className="font-bold text-[14px] text-on-surface-variant uppercase tracking-[0.05em]">Active Residents</div>
        </div>
        <div className="border-l border-outline-variant pl-8 py-4">
          <div className="text-[80px] leading-[80px] font-extrabold text-primary">120+</div>
          <div className="font-bold text-[14px] text-on-surface-variant uppercase tracking-[0.05em]">Global Cities</div>
        </div>
        <div className="border-l border-outline-variant pl-8 py-4">
          <div className="text-[80px] leading-[80px] font-extrabold text-primary">100%</div>
          <div className="font-bold text-[14px] text-on-surface-variant uppercase tracking-[0.05em]">Verified Stays</div>
        </div>
      </div>
    </section>
  );
};