
import React from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import AdminHeader from "@/components/AdminHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import SystemBanners from "@/components/banners/SystemBanners";

interface AdminPanelLayoutProps {
  children?: React.ReactNode;
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  const { user } = useUser();

  return (
    <AuthTransitionWrapper 
      requireAuth={true} 
      allowedRoles={["admin"]} 
      showFallback={true}
      redirectTo="/auth"
    >
      <div className="flex flex-col h-screen bg-background">
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
    </AuthTransitionWrapper>
  );
}
