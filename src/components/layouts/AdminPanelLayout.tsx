
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import AdminHeader from "@/components/AdminHeader";
import { CollapsibleAdminSidebar } from "@/components/admin/CollapsibleAdminSidebar";
import SystemBanners from "@/components/banners/SystemBanners";
import { AdminAccessSelfTest } from "@/components/admin/AdminAccessSelfTest";

interface AdminPanelLayoutProps {
  children?: React.ReactNode;
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AuthTransitionWrapper 
      requireAuth={true} 
      allowedRoles={["admin"]} 
      showFallback={true}
    >
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar with proper height - Only rendered here, not in AdminHeader */}
        <CollapsibleAdminSidebar className="hidden md:flex h-screen" />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AdminHeader />
          {/* Add SystemBanners right under the header */}
          <SystemBanners />
          <div className="flex-1 overflow-auto">
            {/* Add Admin Self-Test floating button */}
            <div className="fixed bottom-4 right-4 z-50">
              <AdminAccessSelfTest />
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
