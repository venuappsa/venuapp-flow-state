
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import HostHeader from "@/components/HostHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

interface HostPanelLayoutProps {
  children?: React.ReactNode;
}

export default function HostPanelLayout({ children }: HostPanelLayoutProps) {
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AuthTransitionWrapper 
      requireAuth={true} 
      allowedRoles={["host"]} 
      showFallback={true}
    >
      <div className="flex h-screen overflow-hidden bg-venu-soft-gray/30">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <HostHeader />
          <div className="flex-1 overflow-auto pt-16">
            <ScrollArea className="h-full">
              <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
                {children || <Outlet />}
              </main>
            </ScrollArea>
          </div>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
}
