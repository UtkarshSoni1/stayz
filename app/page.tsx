import React from "react";
import { TopNavBar } from "../components/home/TopNavBar";
import { Hero } from "../components/home/Hero";
import { BottomNavBar } from "../components/home/BottomNavBar";
import { Mission } from "@/components/home/Mission";
import { EditorialCollage } from "@/components/home/EditorialCollage";
import { Stats } from "@/components/home/Stats";
import { FAQPanels } from "@/components/home/FAQPanels";
import { EditorialBreak } from "@/components/home/EditorialBreak";
import { Voices } from "@/components/home/Voices";
import { EditorialFooter } from "@/components/home/EditorialFooter";

const App: React.FC = () => {
  return (
    <div className="bg-[#131313] text-on-background antialiased min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      <TopNavBar />
      <Hero />
      <Mission/>
      <EditorialCollage/>
      <Stats/>
      <FAQPanels/>
      <EditorialBreak/>
      <Voices/>
      <EditorialFooter/>
      <BottomNavBar />
    </div>
  );
};

export default App;