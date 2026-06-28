import React from "react";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

interface FooterNavLinkProps {
  label: string;
  href: string;
  icon: string;
  isExternal?: boolean;
}

export const FooterNavLink: React.FC<FooterNavLinkProps> = ({ label, href, icon, isExternal = false }) => {
  return (
    <a 
      href={href}
      className="relative transition-color duration-300 py-1 md:py-2 border-b border-outline-variant group flex justify-between items-center after:content-[''] after:absolute after:w-0 after:height-[2px] after:bottom-0 after:left-0 after:bg-white after:transition-[width] after:duration-400 after:ease-[cubic-bezier(0.165,0.84,0.44,1)] hover:text-white hover:after:w-full"
    >
      <span className="text-[18px] leading-[36px] md:text-[28px] md:leading-[24px] font-black uppercase tracking-tight">
        {label}
      </span>
      <span 
        className={`material-symbols-outlined ${!isExternal ? "opacity-0 text-4xl group-hover:opacity-100 transition-all duration-300 transform -translate-x-[10px] group-hover:translate-x-0" : ""}`}
      >
        <BsArrowUpRightCircleFill />
      </span>
    </a>
  );
};