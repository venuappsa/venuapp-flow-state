
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import HostHeader from "@/components/HostHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

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
      <div className="flex flex-col h-screen bg-venu-soft-gray/30">
        <HostHeader />
        <div className="flex-1 overflow-auto pt-16">
          <ScrollArea className="h-full">
            <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
              {children || <Outlet />}
            </main>
          </ScrollArea>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
}
