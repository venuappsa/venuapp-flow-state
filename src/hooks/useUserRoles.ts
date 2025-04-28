
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserRoles(userId?: string | null) {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: async () => {
      console.log("useUserRoles: Fetching roles for userId:", userId);
      if (!userId) return [];
      
      try {
        // The explicit 'as any' cast fixes the type error until types are updated with the real schema
        const { data, error } = await (supabase as any)
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);
          
        if (error) {
          console.error("useUserRoles: Error fetching roles:", error);
          throw error;
        }
        
        const roles = data?.map((r: { role: string }) => r.role) || [];
        console.log("useUserRoles: Fetched roles:", roles);
        return roles;
      } catch (err) {
        console.error("useUserRoles: Exception in fetch:", err);
        throw err;
      }
    },
    enabled: !!userId,
    staleTime: 60000, // Cache for 1 minute
    cacheTime: 300000, // Keep in cache for 5 minutes
    retry: 2, // Retry failed requests up to 2 times
  });
}
