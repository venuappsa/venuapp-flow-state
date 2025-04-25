
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserRoles(userId?: string | null) {
  return useQuery({
    queryKey: ["user-roles", userId],
    queryFn: async () => {
      if (!userId) return [];
      // The explicit 'as any' cast fixes the type error until types are updated with the real schema
      const { data, error } = await (supabase as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (error) throw error;
      return data?.map((r: { role: string }) => r.role) || [];
    },
    enabled: !!userId,
  });
}

