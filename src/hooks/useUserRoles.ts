
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export function useUserRoles(userId?: string | null) {
  const { toast } = useToast();
  
  const query = useQuery({
    queryKey: ["user-roles", userId],
    queryFn: async () => {
      console.log("useUserRoles: Fetching roles for userId:", userId);
      if (!userId) return [] as string[];
      
      try {
        // First attempt with normal client
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);
          
        if (error) {
          console.error("useUserRoles: Error fetching roles:", error);
          throw error;
        }
        
        const roles = data?.map((r: { role: string }) => r.role) || [];
        console.log("useUserRoles: Fetched roles:", roles);
        return roles as string[];
      } catch (error) {
        console.error("useUserRoles: Exception during role fetch:", error);
        
        // Try refreshing the session on error
        try {
          console.log("useUserRoles: Attempting to refresh session");
          const { data: refreshData } = await supabase.auth.refreshSession();
          if (refreshData.session) {
            console.log("useUserRoles: Session refreshed, retrying role fetch");
            
            // Retry after session refresh
            const { data: retryData, error: retryError } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", userId);
              
            if (retryError) {
              console.error("useUserRoles: Error after refresh:", retryError);
              throw retryError;
            }
            
            const retryRoles = retryData?.map((r: { role: string }) => r.role) || [];
            console.log("useUserRoles: Fetched roles after refresh:", retryRoles);
            return retryRoles as string[];
          }
        } catch (refreshError) {
          console.error("useUserRoles: Error refreshing session:", refreshError);
        }
        
        // If all attempts fail, return empty array
        return [] as string[];
      }
    },
    enabled: !!userId,
    staleTime: 5000, // Cache for 5 seconds - reduced from 30s to refresh more often when developing
    gcTime: 300000, // Keep in cache for 5 minutes (updated from cacheTime which is deprecated)
    retry: 3, // Increase retry count to 3
    retryDelay: attempt => Math.min(1000 * (2 ** attempt), 30000),
  });
  
  // Force a refetch when userId changes
  useEffect(() => {
    if (userId) {
      query.refetch();
    }
  }, [userId, query.refetch]);
  
  return query;
}
