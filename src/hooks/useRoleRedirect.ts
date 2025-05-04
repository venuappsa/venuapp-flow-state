
import { useEffect, useState } from "react";
import { UserService } from "@/services/UserService";
import type { Enums } from "@/integrations/supabase/types";

/**
 * Helper function to determine where to redirect a user based on their roles
 * This function prioritizes admin > host > merchant > fetchman > customer roles
 * @param roles Array of user roles
 * @returns The path to redirect the user to
 */
export const getRedirectPageForRoles = (roles: string[]): string => {
  console.log("getRedirectPageForRoles called with roles:", roles);
  
  if (!Array.isArray(roles) || roles.length === 0) {
    console.log("No roles provided or invalid roles format, defaulting to /");
    return "/";
  }

  // Safe type check function
  const hasRole = (role: Enums<"app_role"> | string): boolean => {
    return roles.includes(role);
  };

  // Role priority: admin > host > merchant > fetchman > customer
  if (hasRole("admin")) {
    console.log("Admin role found, redirecting to admin dashboard");
    return "/admin"; // This matches the route in App.tsx
  }
  
  if (hasRole("host")) {
    console.log("Host role found, redirecting to host dashboard");
    return "/host"; // Updated to match actual route paths
  }
  
  if (hasRole("merchant")) {
    console.log("Merchant role found, redirecting to vendor dashboard");
    return "/vendor"; // Updated to match actual route paths
  }
  
  if (hasRole("fetchman")) {
    console.log("Fetchman role found, redirecting to fetchman dashboard");
    return "/fetchman"; // This matches the route in App.tsx
  }
  
  if (hasRole("customer")) {
    console.log("Customer role found, redirecting to homepage");
    return "/";
  }
  
  // Default fallback
  console.log("No matching roles found, defaulting to homepage");
  return "/";
};

/**
 * Custom hook to use role-based redirection
 * @param userId User ID to check roles for
 * @returns Object containing the redirect path and loading state
 */
export const useRoleRedirect = (userId?: string): { path: string, loading: boolean } => {
  const [redirectPath, setRedirectPath] = useState<string>("/");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchRoles = async () => {
      if (!userId) {
        setRedirectPath("/");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const userRoles = await UserService.getUserRoles(userId);
        const path = getRedirectPageForRoles(userRoles);
        setRedirectPath(path);
      } catch (error) {
        console.error("Error in useRoleRedirect:", error);
        setRedirectPath("/");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoles();
  }, [userId]);
  
  return { path: redirectPath, loading: isLoading };
};

export default useRoleRedirect;
