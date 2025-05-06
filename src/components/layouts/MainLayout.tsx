
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTop } from "@/components/utils/ScrollToTop";
import { useTheme } from "@/components/ui/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <Navbar />
      <main className="flex-grow w-full">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
