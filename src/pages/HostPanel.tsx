
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useSubscription } from "@/hooks/useSubscription";
import { useBreakpoint } from "@/hooks/useResponsive";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UnifiedDashboard from "@/components/host/UnifiedDashboard";
import HostPanelLayout from "@/components/layouts/HostPanelLayout";

export default function HostPanel() {
  const { user } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  const { subscribed, subscription_tier, subscription_status } = useSubscription();
  const breakpoint = useBreakpoint();

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-amber-100 text-amber-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "trial":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <HostPanelLayout>
      {rolesLoading ? (
        <div className="max-w-7xl mx-auto py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Host Dashboard</h1>
              <Badge className={getStatusColor(subscription_status)}>
                {subscription_tier || "Free Plan"}
              </Badge>
              {!subscribed && (
                <Link to="/#pricing">
                  <Button size="sm" variant="outline" className="text-xs h-7">Upgrade</Button>
                </Link>
              )}
            </div>
          </div>
          
          <UnifiedDashboard />
        </div>
      )}
    </HostPanelLayout>
  );
}
