
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import AdminHeader from "@/components/AdminHeader";
import { CollapsibleAdminSidebar } from "@/components/admin/CollapsibleAdminSidebar";
import SystemBanners from "@/components/banners/SystemBanners";
import { AdminAccessSelfTest } from "@/components/admin/AdminAccessSelfTest";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSidebar } from "@/contexts/SidebarContext";

interface AdminPanelLayoutProps {
  children?: React.ReactNode;
}

function AdminPanelLayoutContent() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useSidebar();
  
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar with proper height - Only rendered here, not in AdminHeader */}
      <CollapsibleAdminSidebar className="hidden md:flex h-screen" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader />
        {/* Add SystemBanners right under the header */}
        <SystemBanners />
        <div className="flex-1 overflow-auto pt-16">
          {/* Add Admin Self-Test floating button */}
          <div className="fixed bottom-4 right-4 z-50">
            <AdminAccessSelfTest />
          </div>
          <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Mobile drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <CollapsibleAdminSidebar onNavItemClick={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  return (
    <AuthTransitionWrapper 
      requireAuth={true} 
      allowedRoles={["admin"]} 
      showFallback={true}
    >
      <SidebarProvider>
        <AdminPanelLayoutContent />
      </SidebarProvider>
    </AuthTransitionWrapper>
  );
}
