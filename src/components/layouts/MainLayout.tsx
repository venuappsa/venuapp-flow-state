
import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ScrollToTop } from "@/components/utils/ScrollToTop";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
