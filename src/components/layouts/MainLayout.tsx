
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTop } from "@/components/utils/ScrollToTop";
import { useTheme } from "@/components/ui/theme-provider";

export default function MainLayout() {
  const { theme } = useTheme();
  
  // Debug the current theme
  useEffect(() => {
    console.log(`MainLayout rendered with theme: ${theme}`);
    console.log(`Document class list: ${document.documentElement.classList}`);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollToTop />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
