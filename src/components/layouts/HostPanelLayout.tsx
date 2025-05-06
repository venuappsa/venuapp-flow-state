
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import HostHeader from "@/components/HostHeader";
import { useToast } from "@/components/ui/use-toast";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import SystemBanners from "@/components/banners/SystemBanners";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Ensure the sidebar takes the full height and is only rendered here */}
        <DashboardSidebar className="hidden md:flex h-screen" />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <HostHeader />
          {/* Add SystemBanners right under the header */}
          <SystemBanners />
          <div className="flex-1 overflow-auto">
            <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
              <ErrorBoundary>
                {children || <Outlet />}
              </ErrorBoundary>
            </main>
          </div>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
}
