import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import RedirectLoaderOverlay from "@/components/RedirectLoaderOverlay";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";
import { Skeleton } from "@/components/ui/skeleton";
import { UserService } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthTransitionWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
  showFallback?: boolean;
}

export default function AuthTransitionWrapper({ 
  children, 
  requireAuth = false,
  allowedRoles = [],
  redirectTo = "/",
  showFallback = true
}: AuthTransitionWrapperProps) {
  const { user, initialized, loading: userLoading } = useUser();
  const { data: roles = [], isLoading: rolesLoading, isError: rolesError, refetch } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [message, setMessage] = useState("Loading...");
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  
  // Track redirect attempts and add circuit breaker
  const redirectAttemptsRef = useRef(0);
  const MAX_REDIRECT_ATTEMPTS = 2;
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const DEBUG_MODE = true; // Set to true to enable debug logging

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      // Clean up any pending timeout
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  // Custom function to fetch roles directly
  const fetchUserRoles = async (userId: string) => {
    try {
      if (DEBUG_MODE) console.log("AuthTransitionWrapper: Directly fetching roles for user:", userId);
      const userRoles = await UserService.getUserRoles(userId);
      if (DEBUG_MODE) console.log("AuthTransitionWrapper: Direct role fetch result:", userRoles);
      return userRoles;
    } catch (err) {
      console.error("Error fetching user roles in AuthTransitionWrapper:", err);
      return [];
    }
  };
  
  // Function to verify session against Supabase directly
  const verifySession = async () => {
    try {
      if (DEBUG_MODE) console.log("AuthTransitionWrapper: Verifying session directly");
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("AuthTransitionWrapper: Session verification error:", error);
        return false;
      }
      
      const hasValidSession = !!data.session;
      if (DEBUG_MODE) console.log("AuthTransitionWrapper: Valid session:", hasValidSession);
      return hasValidSession;
    } catch (err) {
      console.error("AuthTransitionWrapper: Error verifying session:", err);
      return false;
    }
  };

  // Function to refresh the session token
  const refreshSession = async () => {
    try {
      if (DEBUG_MODE) console.log("AuthTransitionWrapper: Attempting to refresh session");
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("AuthTransitionWrapper: Session refresh error:", error);
        return false;
      }
      
      const sessionRefreshed = !!data.session;
      if (DEBUG_MODE) console.log("AuthTransitionWrapper: Session refreshed:", sessionRefreshed);
      return sessionRefreshed;
    } catch (err) {
      console.error("AuthTransitionWrapper: Error refreshing session:", err);
      return false;
    }
  };

  useEffect(() => {
    if (!mounted) return;
    
    // Wait for user auth to be initialized before proceeding
    if (!initialized || userLoading) {
      if (DEBUG_MODE) console.log("AuthTransitionWrapper: Waiting for auth initialization...");
      return;
    }

    // If no auth required and no roles to check, render immediately
    if (!requireAuth && !allowedRoles.length) {
      if (DEBUG_MODE) console.log("AuthTransitionWrapper: No auth required, rendering content");
      setIsTransitioning(false);
      return;
    }

    // Circuit breaker to prevent infinite redirect loops
    if (redirectAttemptsRef.current >= MAX_REDIRECT_ATTEMPTS) {
      console.log(`AuthTransitionWrapper: Max redirect attempts reached (${redirectAttemptsRef.current}), showing content anyway`);
      setIsTransitioning(false);
      return;
    }

    // Handle no user case when auth is required
    if (requireAuth && !user) {
      console.log("AuthTransitionWrapper: Auth required but no user found, redirecting to login");
      setMessage("Please log in to continue...");
      redirectAttemptsRef.current += 1;
      
      // Store current location for redirect after login
      const currentPath = window.location.pathname;
      
      // Use timeout to avoid interrupting render and prevent immediate redirect
      redirectTimeoutRef.current = setTimeout(() => {
        if (mounted) {
          // Include next parameter for redirect after login
          const redirectUrl = `${redirectTo}?next=${encodeURIComponent(currentPath)}`;
          navigate(redirectUrl, { 
            replace: true,
            state: { from: currentPath } 
          });
        }
      }, 100);
      return;
    }

    const checkUserRoles = async () => {
      if (!user) return;
      
      // Verify session is still valid
      const isSessionValid = await verifySession();
      if (!isSessionValid) {
        console.log("AuthTransitionWrapper: Session no longer valid, attempting refresh");
        const refreshed = await refreshSession();
        if (!refreshed) {
          console.log("AuthTransitionWrapper: Session refresh failed, redirecting to login");
          setMessage("Your session has expired. Please log in again.");
          
          redirectTimeoutRef.current = setTimeout(() => {
            if (mounted) {
              navigate(redirectTo, { replace: true });
            }
          }, 100);
          return false;
        }
      }
      
      // First see if we have roles from the hook
      let userRoles = roles;
      
      // If roles are loading or empty, try fetching directly
      if ((rolesLoading || roles.length === 0) && allowedRoles.length > 0) {
        setMessage("Checking your permissions...");
        
        // Try direct fetch from database
        userRoles = await fetchUserRoles(user.id);
        
        // If still empty, try one more time after a short delay
        if (userRoles.length === 0) {
          if (DEBUG_MODE) console.log("AuthTransitionWrapper: Roles still empty after direct fetch, retrying...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          userRoles = await fetchUserRoles(user.id);
        }
      }
      
      // Log for debugging
      if (DEBUG_MODE) {
        console.log("AuthTransitionWrapper: User ID:", user.id);
        console.log("AuthTransitionWrapper: User Roles:", userRoles);
        console.log("AuthTransitionWrapper: Required Roles:", allowedRoles);
      }
      
      // Check roles if needed
      if (allowedRoles.length > 0) {
        const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role));
        
        if (!hasAllowedRole) {
          console.log("AuthTransitionWrapper: User lacks required role, redirecting");
          toast({
            title: "Access Restricted",
            description: "You don't have permission to access this area.",
            variant: "destructive",
          });
          setMessage("Redirecting to appropriate page...");
          redirectAttemptsRef.current += 1;
          
          const redirectPath = getRedirectPageForRoles(userRoles);
          if (DEBUG_MODE) console.log("AuthTransitionWrapper: Redirecting to:", redirectPath);
          
          // Use timeout to avoid interrupting render
          redirectTimeoutRef.current = setTimeout(() => {
            if (mounted) {
              navigate(redirectPath, { replace: true });
            }
          }, 100);
          return false;
        } else {
          if (DEBUG_MODE) console.log("AuthTransitionWrapper: User has required role:", hasAllowedRole);
        }
      }
      
      return true;
    };
    
    const processAuthentication = async () => {
      if (user) {
        const roleCheckPassed = await checkUserRoles();
        if (roleCheckPassed) {
          if (DEBUG_MODE) console.log("AuthTransitionWrapper: User is authorized, showing content");
          setIsTransitioning(false);
        }
      }
    };
    
    processAuthentication();
    
  }, [user, roles, rolesLoading, requireAuth, redirectTo, navigate, allowedRoles, mounted, initialized, userLoading, refetch, toast]);

  // If in transition and we want to show a fallback
  if (isTransitioning && showFallback) {
    return <RedirectLoaderOverlay message={message} />;
  }

  // If loading roles but we don't need to show full overlay
  if (rolesLoading && requireAuth && !isTransitioning) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-full mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
