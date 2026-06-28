import React from "react";
import { TestimonialCard, TestimonialProps } from "./TestimonialCard";

const row1Testimonials: TestimonialProps[] = [
  {
    stars: 5,
    quote: '"The attention to detail at Stayz is unmatched. Every room feels like a curated experience rather than just a place to sleep."',
    name: "Sarah Thompson",
    role: "Project Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
  },
  {
    stars: 5,
    quote: '"Seamless booking and incredible tech integration. As a developer, I appreciate the efficiency and the aesthetic."',
    name: "Michael Chen",
    role: "Software Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
  },
  {
    stars: 5,
    quote: '"The data-driven recommendations for local spots were spot on. A truly personalized stay from start to finish."',
    name: "Emily Rodriguez",
    role: "Data Analyst",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
  }
];

const row2Testimonials: TestimonialProps[] = [
  {
    stars: 5,
    quote: '"The perfect balance of luxury and comfort. I\'ve stayed in hotels worldwide, but Stayz feels like home."',
    name: "Alex Rahman",
    role: "Business Owner",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
  },
  {
    stars: 5,
    quote: '"Reliable high-speed internet and a quiet environment. Exactly what I need for my business trips."',
    name: "David Patel",
    role: "IT Consultant",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
  },
  {
    stars: 5,
    quote: '"The branding and interior design are incredibly photogenic. A dream for any marketing professional."',
    name: "Olivia Harper",
    role: "Marketing Specialist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
  },
  {
    stars: 5,
    quote: '"Efficiency at its finest. The check-in process was the smoothest I\'ve ever experienced."',
    name: "James Carter",
    role: "Operations Manager",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80"
  }
];

export const Voices: React.FC = () => {
  return (
    <main className="relative min-h-screen overflow-hidden py-[160px]">
      <div 
        className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none z-0" 
        style={{ background: "radial-gradient(circle at bottom center, rgba(52, 110, 246, 0.4) 0%, rgba(17, 19, 27, 0) 70%)" }}
      />
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-[64px]">
        <header className="text-center mb-16">
          <h2 className="font-sans text-[48px] md:text-[80px] md:leading-[80px] font-black tracking-tighter text-white uppercase mb-4">
            VOICES FROM EVERY STAY
          </h2>
          <div className="h-1 w-24 bg-primary-container mx-auto" />
        </header>

        <div className="flex flex-col gap-6 overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {row1Testimonials.map((item, index) => (
              <TestimonialCard key={index} {...item} />
            ))}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {row2Testimonials.map((item, index) => (
              <TestimonialCard key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};