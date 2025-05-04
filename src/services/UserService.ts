
import { supabase } from "@/integrations/supabase/client";

export const UserService = {
  /**
   * Get roles for a specific user directly from the database
   * @param userId The user ID to fetch roles for
   * @returns Array of role strings
   */
  getUserRoles: async (userId: string): Promise<string[]> => {
    console.log("UserService: Fetching roles for user:", userId);
    
    if (!userId) {
      console.warn("UserService: No user ID provided for role lookup");
      return [];
    }

    try {
      // First attempt with normal client
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
        
      if (error) {
        console.error("UserService: Error fetching roles:", error);
        throw error;
      }
      
      const roles = data?.map((r: { role: string }) => r.role) || [];
      console.log("UserService: Fetched roles:", roles);
      return roles;
    } catch (initialError) {
      console.error("UserService: Initial error fetching roles:", initialError);
      
      // Try refreshing the session and fetching again
      try {
        console.log("UserService: Attempting to refresh session");
        const { data: refreshData } = await supabase.auth.refreshSession();
        
        if (refreshData.session) {
          console.log("UserService: Session refreshed, retrying role fetch");
          
          // Try again with refreshed session
          const { data: retryData, error: retryError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userId);
            
          if (retryError) {
            console.error("UserService: Error after session refresh:", retryError);
            throw retryError;
          }
          
          const retryRoles = retryData?.map((r: { role: string }) => r.role) || [];
          console.log("UserService: Fetched roles after refresh:", retryRoles);
          return retryRoles;
        } else {
          console.warn("UserService: Session refresh returned no session");
          return [];
        }
      } catch (refreshError) {
        console.error("UserService: Error refreshing session:", refreshError);
        return [];
      }
    }
  },
  
  /**
   * Check if the current user has admin role
   */
  isUserAdmin: async (): Promise<boolean> => {
    try {
      console.log("UserService: Checking if current user is admin");
      
      // Use the RPC function we created in the database
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error("UserService: Error checking admin status:", error);
        return false;
      }
      
      console.log("UserService: Admin check result:", data);
      return !!data;
    } catch (error) {
      console.error("UserService: Exception checking admin status:", error);
      return false;
    }
  },
  
  /**
   * Get the current user's session
   */
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("UserService: Error getting session:", error);
        return null;
      }
      
      return data.session;
    } catch (error) {
      console.error("UserService: Exception getting session:", error);
      return null;
    }
  },
  
  /**
   * Force refresh the current user's session
   */
  refreshUserSession: async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("UserService: Error refreshing session:", error);
        return null;
      }
      
      return data.session;
    } catch (error) {
      console.error("UserService: Exception refreshing session:", error);
      return null;
    }
  }
};
