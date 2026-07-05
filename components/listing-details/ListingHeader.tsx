"use client";

interface ListingHeaderProps {
  title: string;
}

export function ListingHeader({ title }: ListingHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
      <h1 className="font-display-lg text-headline-lg md:text-[64px] font-black tracking-tighter text-white uppercase">
        {title}
      </h1>
      <div className="flex gap-3">
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant hover:bg-surface-container transition-all group active:scale-95"
        >
          <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
            ios_share
          </span>
          <span className="font-label-bold uppercase tracking-widest text-xs">Share</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant hover:bg-surface-container transition-all group active:scale-95"
        >
          <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
            favorite
          </span>
          <span className="font-label-bold uppercase tracking-widest text-xs">Save</span>
        </button>
      </div>
    </header>
  );
}
