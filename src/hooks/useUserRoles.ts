
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserRoles(userId?: string | null) {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: async () => {
      console.log("useUserRoles: Fetching roles for userId:", userId);
      if (!userId) return [] as string[];
      
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
    },
    enabled: !!userId,
    staleTime: 5000, // Cache for 5 seconds - reduced from 30s to refresh more often when developing
    gcTime: 300000, // Keep in cache for 5 minutes (updated from cacheTime which is deprecated)
    retry: 2, // Retry failed requests up to 2 times
    retryDelay: attempt => Math.min(attempt > 1 ? 2000 : 1000, 30000),
  });
}
