
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type AppRole = "admin" | "host" | "merchant" | "customer" | "fetchman";

const ROLE_PRIORITY: AppRole[] = [
  "admin",
  "host",
  "merchant",
  "fetchman",
  "customer",
];

// Store the last redirect time to prevent infinite loops
let lastRedirectTime = 0;
const REDIRECT_COOLDOWN = 2000; // 2 seconds cooldown between redirects

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
  const location = useLocation();
  const [redirectAttempts, setRedirectAttempts] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let redirectTimer: NodeJS.Timeout;
    
    // Don't redirect if we're already on the auth page
    if (location.pathname === "/auth") {
      if (pendingRedirect && isMounted) {
        console.log("useRoleRedirect: Already on /auth, canceling pending redirect");
        setPendingRedirect(false);
      }
      return;
    }
    
    // Prevent too many redirect attempts
    if (redirectAttempts > 3) {
      console.log("useRoleRedirect: Too many redirect attempts, stopping");
      if (isMounted) setPendingRedirect(false);
      return;
    }
    
    if (pendingRedirect && userId && userRoles && !rolesLoading) {
      // Check if we're in a cooldown period to prevent infinite loops
      const now = Date.now();
      if (now - lastRedirectTime < REDIRECT_COOLDOWN) {
        console.log("useRoleRedirect: Redirect on cooldown, waiting");
        return;
      }
      
      const rolesArray = Array.isArray(userRoles) ? userRoles : [];
      console.log("Detected roles after login:", rolesArray);
      const redirectTo = getRedirectPageForRoles(rolesArray);
      console.log("Redirecting to:", redirectTo);
      
      if (redirectTo !== location.pathname) {
        lastRedirectTime = now; // Update the last redirect time
        redirectTimer = setTimeout(() => {
          if (isMounted) {
            console.log(`useRoleRedirect: Navigating to ${redirectTo}`);
            navigate(redirectTo, { replace: true });
            setPendingRedirect(false);
            setRedirectAttempts(prev => prev + 1);
          }
        }, 100);
      } else {
        if (isMounted) {
          console.log("useRoleRedirect: Already on the correct page, canceling pending redirect");
          setPendingRedirect(false);
        }
      }
    }
    
    return () => {
      isMounted = false;
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [pendingRedirect, userId, userRoles, rolesLoading, navigate, setPendingRedirect, location.pathname, redirectAttempts]);
}
