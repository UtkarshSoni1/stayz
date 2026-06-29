import React from "react";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

export const TrendingCard: React.FC = () => {
  return (
    <div className="md:w-[420px] animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
      <p className="font-bold text-[14px] text-primary mb-4 tracking-[0.2em] opacity-80">
        TRENDING NEAR YOU
      </p>
      <div className="bg-[rgba(25,25,25,0.6)] backdrop-blur-[40px] border border-white/10 p-6 rounded-xl transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group">
        <div className="relative overflow-hidden rounded-lg mb-6 h-56">
          <img
            alt="A sleek, minimalist Scandinavian-style bedroom with warm lighting and premium textures"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] brightness-[0.7]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW3fz44awf92gwrKj1RHFLmjC31A3zqr1Gthx5q6BTMBC39J77cA23KicQtUcDRVkZdFoSEMoHaNrDSWAqqBy6cWlBEw6GXYg7eFmOZq5qJVHQ_t0cTIae9GuQhQovdv_ssdzofMoEHu3Z0Cv3BgLm9jf5BzUcyprmVWn6su4DUDS1Zw9s_Gu63EsMsZFh_OcVLvSbnIYScVU-POo9RvY5TMQaSNHblFk6kcF3mzPU5rzxGyTushMrM8XzD35GUl2CtjwKy150prRa"
          />
          <div className="absolute top-4 right-4 bg-primary-container text-on-primary-fixed px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">
            Top Rated
          </div>
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex gap-2 mb-2">
              <span className="bg-surface-container-highest text-primary text-[10px] px-2 py-1 rounded font-bold uppercase">PG</span>
              <span className="bg-surface-container-highest text-primary text-[10px] px-2 py-1 rounded font-bold uppercase">Furnished</span>
              <span className="bg-surface-container-highest text-primary text-[10px] px-2 py-1 rounded font-bold uppercase">Girls Only</span>
            </div>
            <h3 className="text-[32px] leading-[36px] font-extrabold text-primary">Skyline Lofts, Sector 45</h3>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <p className="font-bold text-[14px]">Downtown Metropolis</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <span className="text-primary-fixed text-2xl font-black">₹24,500</span>
            <span className="text-on-surface-variant text-sm font-bold">/ MONTH</span>
          </div>
          <button className="bg-primary text-background p-2 rounded-full hover:bg-primary-fixed transition-colors">
            <BsArrowUpRightCircleFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};