
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import AdminHeader from "@/components/AdminHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import SystemBanners from "@/components/banners/SystemBanners";
import { CollapsibleAdminSidebar } from "@/components/admin/CollapsibleAdminSidebar";

interface AdminPanelLayoutProps {
  children?: React.ReactNode;
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  const { user } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AuthTransitionWrapper 
      requireAuth={true} 
      allowedRoles={["admin"]} 
      showFallback={true}
      redirectTo="/auth"
    >
      <div className="flex h-screen bg-background">
        <div className="hidden md:flex">
          <CollapsibleAdminSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 overflow-auto pt-16">
            <ScrollArea className="h-full">
              <div className="px-4 md:px-8 py-4">
                <SystemBanners />
              </div>
              <main className="px-4 md:px-8 py-4">
                {children || <Outlet />}
              </main>
            </ScrollArea>
          </div>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
}
