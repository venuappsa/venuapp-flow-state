
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type AppRole = "admin" | "host" | "merchant" | "customer" | "fetchman";

const ROLE_PRIORITY: AppRole[] = [
  "admin",
  "host",
  "merchant",
  "fetchman",
  "customer",
];

export function getRedirectPageForRoles(roles: string[]): string {
  console.log("getRedirectPageForRoles called with roles:", roles);
  
  // Safety check - if roles is invalid, return to home
  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    console.log("No valid roles found, defaulting to home page");
    return "/";
  }
  
  for (const role of ROLE_PRIORITY) {
    if (roles.includes(role)) {
      const redirectPath = `/${role}`;
      console.log(`Found priority role ${role}, redirecting to ${redirectPath}`);
      return redirectPath;
    }
  }
  
  console.log("No matching roles found in priority list, defaulting to home page");
  return "/";
}

export function useRoleRedirect({
  pendingRedirect,
  userId,
  userRoles,
  rolesLoading,
  setPendingRedirect,
}: {
  pendingRedirect: boolean;
  userId: string | null;
  userRoles: string[];
  rolesLoading: boolean;
  setPendingRedirect: (v: boolean) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;
    let redirectTimer: NodeJS.Timeout;
    
    if (pendingRedirect && userId && userRoles && !rolesLoading) {
      const rolesArray = Array.isArray(userRoles) ? userRoles : [];
      console.log("Detected roles after login:", rolesArray);
      const redirectTo = getRedirectPageForRoles(rolesArray);
      console.log("Redirecting to:", redirectTo);
      
      if (redirectTo !== window.location.pathname) {
        // Use a small timeout to ensure smoother transitions
        redirectTimer = setTimeout(() => {
          if (isMounted) {
            navigate(redirectTo, { replace: true });
            setPendingRedirect(false);
          }
        }, 100);
      } else {
        if (isMounted) {
          setPendingRedirect(false);
        }
      }
    }
    
    // Clean up timer when component unmounts
    return () => {
      isMounted = false;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [pendingRedirect, userId, userRoles, rolesLoading, navigate, setPendingRedirect]);
}
