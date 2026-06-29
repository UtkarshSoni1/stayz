// components/theme-provider.tsx

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
    >
      <TooltipProvider delayDuration={200}>
        {children}
      </TooltipProvider>
    </NextThemesProvider>
  );
}