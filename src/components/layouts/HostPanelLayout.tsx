
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import HostHeader from "@/components/HostHeader";

interface HostPanelLayoutProps {
  children?: React.ReactNode;
}

export default function HostPanelLayout({ children }: HostPanelLayoutProps) {
  const { user } = useUser();

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
      <div className="min-h-screen bg-gray-50">
        <HostHeader />
        <main className="pt-16 px-4 md:px-6 lg:px-8 pb-8">
          {children || <Outlet />}
        </main>
      </div>
    </AuthTransitionWrapper>
  );
}
