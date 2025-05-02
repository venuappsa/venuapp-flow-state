
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
  const hasRole = (role: Enums<"app_role">): boolean => {
    return roles.includes(role);
  };

  // Role priority: admin > host > merchant > fetchman > customer
  if (hasRole("admin")) {
    console.log("Admin role found, redirecting to admin dashboard");
    return "/admin/dashboard";
  }
  
  if (hasRole("host")) {
    console.log("Host role found, redirecting to host dashboard");
    return "/host/dashboard";
  }
  
  if (hasRole("merchant")) {
    console.log("Merchant role found, redirecting to vendor dashboard");
    return "/vendor/dashboard";
  }
  
  if (hasRole("fetchman")) {
    console.log("Fetchman role found, redirecting to fetchman dashboard");
    return "/fetchman/dashboard";  
  }
  
  if (hasRole("customer")) {
    console.log("Customer role found, redirecting to homepage");
    return "/";
  }
  
  // Default fallback
  console.log("No matching roles found, defaulting to homepage");
  return "/";
};
