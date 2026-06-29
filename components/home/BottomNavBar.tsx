import React from "react";

export const BottomNavBar: React.FC = () => {
  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-[20px] py-4 bg-background/80 border-t border-outline-variant backdrop-blur-xl rounded-t-lg">
      <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-all font-bold text-[14px]">
        <span className="material-symbols-outlined" data-icon="search">search</span>
        <span className="text-[10px]">Explore</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-all font-bold text-[14px]">
        <span className="material-symbols-outlined" data-icon="favorite">favorite</span>
        <span className="text-[10px]">Saved</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-all font-bold text-[14px]">
        <span className="material-symbols-outlined" data-icon="mail">mail</span>
        <span className="text-[10px]">Inbox</span>
      </div>
      <div className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-all font-bold text-[14px]">
        <span className="material-symbols-outlined" data-icon="person">person</span>
        <span className="text-[10px]">Profile</span>
      </div>
    </footer>
  );
};