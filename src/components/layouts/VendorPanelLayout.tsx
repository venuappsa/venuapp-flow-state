
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import VendorHeader from "@/components/vendor/VendorHeader";
import VendorSidebar from "@/components/vendor/VendorSidebar";

interface VendorPanelLayoutProps {
  children?: React.ReactNode;
}

export default function VendorPanelLayout({ children }: VendorPanelLayoutProps) {
  const { user } = useUser();
  const { data: roles = [] } = useUserRoles(user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AuthTransitionWrapper 
      requireAuth={true} 
      allowedRoles={["merchant"]} 
      showFallback={true}
    >
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <VendorSidebar />
        <div className="flex flex-col flex-1">
          <VendorHeader />
          <div className="flex-1 overflow-auto">
            <ScrollArea className="h-full">
              <main className="container px-4 md:px-6 py-8">
                {children || <Outlet />}
              </main>
            </ScrollArea>
          </div>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
}
