
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export type AppRole = "admin" | "host" | "merchant" | "customer" | "fetchman";

const ROLE_PRIORITY: AppRole[] = [
  "admin",
  "host",
  "merchant",
  "fetchman",
  "customer",
];

// Store the last redirect time globally to prevent infinite loops
let lastRedirectTime = 0;
const REDIRECT_COOLDOWN = 3000; // 3 seconds cooldown between redirects

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
  const redirectInProgressRef = useRef(false);

  // Circuit breaker to stop excessive redirects
  const MAX_REDIRECT_ATTEMPTS = 3;
  
  useEffect(() => {
    let isMounted = true;
    let redirectTimer: NodeJS.Timeout | undefined;
    
    // Cleanup function
    const cleanup = () => {
      isMounted = false;
      if (redirectTimer) clearTimeout(redirectTimer);
      redirectInProgressRef.current = false;
    };
    
    // Don't redirect if we're already on the auth page
    if (location.pathname === "/auth") {
      if (pendingRedirect && isMounted) {
        console.log("useRoleRedirect: Already on /auth, canceling pending redirect");
        setPendingRedirect(false);
      }
      return cleanup;
    }
    
    // Prevent too many redirect attempts - circuit breaker
    if (redirectAttempts >= MAX_REDIRECT_ATTEMPTS) {
      console.log(`useRoleRedirect: Too many redirect attempts (${redirectAttempts}), stopping`);
      if (isMounted) setPendingRedirect(false);
      return cleanup;
    }
    
    // Only proceed if we have a pending redirect, a user ID, and roles are loaded
    if (!pendingRedirect || !userId || rolesLoading) {
      return cleanup;
    }
    
    // Check if another redirect is already in progress
    if (redirectInProgressRef.current) {
      console.log("useRoleRedirect: Another redirect is already in progress");
      return cleanup;
    }
    
    // Check if we're in a cooldown period to prevent infinite loops
    const now = Date.now();
    if (now - lastRedirectTime < REDIRECT_COOLDOWN) {
      console.log(`useRoleRedirect: Redirect on cooldown, waiting (${Math.round((REDIRECT_COOLDOWN - (now - lastRedirectTime)) / 1000)}s left)`);
      return cleanup;
    }
    
    // Set the redirect in progress flag
    redirectInProgressRef.current = true;
    
    const rolesArray = Array.isArray(userRoles) ? userRoles : [];
    console.log("useRoleRedirect: Detected roles:", rolesArray);
    const redirectTo = getRedirectPageForRoles(rolesArray);
    console.log("useRoleRedirect: Considering redirect to:", redirectTo);
    
    // Don't redirect if we're already on the target page
    if (redirectTo === location.pathname) {
      console.log("useRoleRedirect: Already on the target page, canceling redirect");
      if (isMounted) {
        setPendingRedirect(false);
        redirectInProgressRef.current = false;
      }
      return cleanup;
    }
    
    // Update the last redirect time
    lastRedirectTime = now;
    
    // Execute the redirect with a timeout to allow state to settle
    redirectTimer = setTimeout(() => {
      if (isMounted) {
        console.log(`useRoleRedirect: Navigating to ${redirectTo} (attempt ${redirectAttempts + 1}/${MAX_REDIRECT_ATTEMPTS})`);
        navigate(redirectTo, { replace: true });
        setPendingRedirect(false);
        setRedirectAttempts(prev => prev + 1);
        redirectInProgressRef.current = false;
      }
    }, 300);
    
    return cleanup;
  }, [pendingRedirect, userId, userRoles, rolesLoading, navigate, setPendingRedirect, location.pathname, redirectAttempts]);
}
