
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import FetchmanHeader from "@/components/fetchman/FetchmanHeader";
import FetchmanSidebar from "@/components/fetchman/FetchmanSidebar";
import SystemBanners from "@/components/banners/SystemBanners";
import { FetchmanFeaturesSelfTest } from "@/components/fetchman/FetchmanFeaturesSelfTest";

interface FetchmanPanelLayoutProps {
  children?: React.ReactNode;
}

export default function FetchmanPanelLayout({ children }: FetchmanPanelLayoutProps) {
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AuthTransitionWrapper 
      requireAuth={true} 
      allowedRoles={["fetchman"]} 
      showFallback={true}
    >
      <div className="flex h-screen overflow-hidden bg-background">
        <FetchmanSidebar />
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <FetchmanHeader />
          
          <SystemBanners />
          
          <div className="flex-1 overflow-auto">
            {/* Add Fetchman Self-Test floating button */}
            <div className="fixed bottom-4 right-4 z-50">
              <FetchmanFeaturesSelfTest />
            </div>
            
            <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
              {children || <Outlet />}
            </main>
          </div>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
}
