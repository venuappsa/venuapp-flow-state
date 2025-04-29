
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useSubscription } from "@/hooks/useSubscription";
import { useBreakpoint } from "@/hooks/useResponsive";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import UnifiedDashboard from "@/components/host/UnifiedDashboard";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";

export default function HostPanel() {
  const { user } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const { subscribed } = useSubscription();
  const breakpoint = useBreakpoint();

  return (
    <HostPanelLayout>
      {rolesLoading ? (
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple">
              Welcome to your Dashboard
            </h1>
          </div>
          
          <UnifiedDashboard />
        </div>
      )}
    </HostPanelLayout>
  );
}
