import React from "react";
import { FaStar } from "react-icons/fa";
export interface TestimonialProps {
  stars: number;
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export const TestimonialCard: React.FC<TestimonialProps> = ({ stars, quote, name, role, avatar }) => {
  return (
    <div className="flex-shrink-0 w-[320px] p-6 rounded-lg bg-[#1a1a2e] border border-white/10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-primary-container/40">
      <div className="flex gap-1 mb-4 text-[#FFD700]">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} className="material-symbols-outlined text-[18px]">
            <FaStar />
          </span>
        ))}
      </div>
      <p className="text-on-surface-variant text-[16px] mb-6 leading-relaxed">
        {quote}
      </p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-white font-bold">{name}</div>
          <div className="text-on-surface-variant text-[12px]">{role}</div>
        </div>
      </div>
    </div>
  );
};