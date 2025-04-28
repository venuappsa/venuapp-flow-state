import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import HostHeader from "@/components/HostHeader";
import { Skeleton } from "@/components/ui/skeleton";

export default function HostPanel() {
  const { user } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);

  useEffect(() => {
    // Ensure content is loaded before removing any loading states
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
        <main className="pt-16 px-4">
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
              <h1 className="text-2xl font-bold mb-6">Host Dashboard</h1>
              {/* Host dashboard content here */}
            </div>
          )}
        </main>
      </div>
    </AuthTransitionWrapper>
  );
}
