
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { ScrollArea } from "@/components/ui/scroll-area";
import VendorSidebar from "@/components/vendor/VendorSidebar";
import VendorHeader from "@/components/vendor/VendorHeader";
import { Skeleton } from "@/components/ui/skeleton";

interface VendorPanelLayoutProps {
  children?: React.ReactNode;
}

export default function VendorPanelLayout({ children }: VendorPanelLayoutProps) {
  const { user, loading: userLoading } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && !user) {
      console.log("VendorPanelLayout - No user found, redirecting to login");
      navigate('/auth/login');
      return;
    }

    if (!rolesLoading && user && roles.length > 0) {
      const isMerchant = roles.some(role => role === 'merchant');

      console.log("VendorPanelLayout mounted - User:", user?.id);
      console.log("VendorPanelLayout - User roles:", roles);
      console.log("VendorPanelLayout - Is merchant:", isMerchant);

      if (!isMerchant) {
        console.log("VendorPanelLayout - User is not a merchant, redirecting to home");
        navigate('/');
      }
    }
  }, [user, userLoading, roles, rolesLoading, navigate]);

  if (userLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex">
        <Skeleton className="w-64 h-full" />
        <div className="flex-1 p-6">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <VendorSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <VendorHeader />
        <ScrollArea className="flex-1 pt-16">
          <main className="px-4 py-6">
            {children || <Outlet />}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
