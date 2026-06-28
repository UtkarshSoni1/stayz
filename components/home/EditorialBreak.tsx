import React from "react";

export const EditorialBreak: React.FC = () => {
  return (
    <div className="mt-[160px] mb-24 px-[64px] flex flex-col md:flex-row justify-between items-end gap-12">
      <div className="max-w-2xl">
        <h3 className="font-sans text-[80px] leading-[80px] font-extrabold tracking-tight mb-8">
          URBAN LIVING<br />REDEFINED.
        </h3>
        <p className="font-sans text-[18px] leading-[28px] text-on-surface-variant">
          We strip away the noise of the traditional rental market to focus on what matters: the space, the vibe, and the people.
        </p>
      </div>
      <div className="flex flex-col items-end gap-4">
        <div className="h-1 w-32 bg-primary" />
        <span className="font-bold text-[14px] uppercase tracking-[0.2em] text-on-surface">
          Available in 12 Cities
        </span>
      </div>
    </div>
  );
};