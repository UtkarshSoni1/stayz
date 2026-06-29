"use client"
import React, { useEffect, useRef } from "react";
import { FooterNavLink } from "./FooterNavLink";
import { SiInstagram } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { SlSocialLinkedin } from "react-icons/sl";
export const EditorialFooter: React.FC = () => {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current || !wordmarkRef.current) return;
      const footerRect = footerRef.current.getBoundingClientRect();
      
      if (footerRect.top < window.innerHeight) {
        const offset = (window.innerHeight - footerRect.top) * 0.1;
        wordmarkRef.current.style.transform = `translateY(${offset}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer ref={footerRef} className="w-full bg-brand-black text-white pt-[160px] pb-8">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[64px]">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] mb-24">
          <div className="md:col-span-6 flex flex-col justify-start items-start mb-12 md:mb-0">
            <div ref={wordmarkRef} className="flex items-start gap-4 transition-transform duration-100 ease-out">
              <span className="font-sans text-[120px] leading-none font-black tracking-tighter select-none">
                STAYZ
              </span>
              <span className="material-symbols-outlined text-[40px] md:text-[64px] mt-2 text-primary">
                
              </span>
            </div>
          </div>

          <div className="md:col-span-6 flex flex-col hover:text-zinc-600">
            <nav className="flex flex-col w-full border-t border-outline-variant">
              <FooterNavLink label="Browse Rooms" href="#" icon="arrow_forward" />
              <FooterNavLink label="List Your Space" href="#" icon="arrow_forward"  />
              <FooterNavLink label="How it Works" href="#" icon="arrow_forward" />
              <FooterNavLink label="About" href="#" icon="arrow_forward" />
              <FooterNavLink label="Contact" href="#" icon="arrow_forward" />
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-[24px] pt-12">
          <div className="md:col-span-6 mb-12 md:mb-0">
            <p className="font-sans text-[16px] leading-[24px] text-on-surface-variant max-w-sm mb-8 leading-relaxed">
              Built for the generation that moves fast, lives bold, and refuses to settle. 
              StayZ is India's room-rental platform for Gen Z — by Gen Z.
            </p>
            <div className="flex gap-6 items-center">
              <a className="text-on-surface-variant hover:text-white transition-colors duration-300 flex items-center gap-2" href="#">
                <span className="material-symbols-outlined text-[18px]"><MdEmail /></span>
                <span className="font-bold text-[14px]">EMAIL</span>
              </a>
              <a className="text-on-surface-variant hover:text-white transition-colors duration-300 flex items-center gap-2" href="#">
                <span className="material-symbols-outlined text-[18px]"><SiInstagram /></span>
                <span className="font-bold text-[14px]">INSTAGRAM</span>
              </a>
              <a className="text-on-surface-variant hover:text-white transition-colors duration-300 flex items-center gap-2" href="#">
                <span className="material-symbols-outlined text-[18px]"><SlSocialLinkedin /></span>
                <span className="font-bold text-[14px]">LINKEDIN</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3 mb-8 md:mb-0">
            <ul className="space-y-3">
              <li><a className="font-bold text-[14px] text-on-surface-variant hover:text-brand-accent transition-colors duration-200" href="#">PGs in Delhi</a></li>
              <li><a className="font-bold text-[14px] text-on-surface-variant hover:text-brand-accent transition-colors duration-200" href="#">Rooms in Bangalore</a></li>
              <li><a className="font-bold text-[14px] text-on-surface-variant hover:text-brand-accent transition-colors duration-200" href="#">Flats in Mumbai</a></li>
              <li><a className="font-bold text-[14px] text-on-surface-variant hover:text-brand-accent transition-colors duration-200" href="#">PGs in Pune</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <ul className="space-y-3">
              <li><a className="font-bold text-[14px] text-on-surface-variant hover:text-brand-accent transition-colors duration-200" href="#">PGs in Hyderabad</a></li>
              <li><a className="font-bold text-[14px] text-on-surface-variant hover:text-brand-accent transition-colors duration-200" href="#">Rooms in Gwalior</a></li>
              <li><a className="font-bold text-[14px] text-on-surface-variant hover:text-brand-accent transition-colors duration-200" href="#">Student Housing</a></li>
              <li><a className="font-bold text-[14px] text-on-surface-variant hover:text-brand-accent transition-colors duration-200" href="#">For Hosts</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-bold text-[10px] tracking-widest text-on-surface-variant uppercase">
            © 2025 StayZ · Made in India 🇮🇳 · No brokers. No BS.
          </p>
          <div className="flex gap-4">
            <a className="font-bold text-[10px] tracking-widest text-on-surface-variant hover:text-white uppercase" href="#">Privacy</a>
            <a className="font-bold text-[10px] tracking-widest text-on-surface-variant hover:text-white uppercase" href="#">Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
};