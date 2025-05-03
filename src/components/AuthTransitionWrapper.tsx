
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import RedirectLoaderOverlay from "@/components/RedirectLoaderOverlay";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";
import { Skeleton } from "@/components/ui/skeleton";
import { UserService } from "@/services/UserService";

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
  redirectTo = "/auth/login",
  showFallback = true
}: AuthTransitionWrapperProps) {
  const { user, initialized, loading: userLoading } = useUser();
  const { data: roles = [], isLoading: rolesLoading, isError: rolesError, refetch } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [message, setMessage] = useState("Loading...");
  const [mounted, setMounted] = useState(false);
  
  // Track redirect attempts and add circuit breaker
  const redirectAttemptsRef = useRef(0);
  const MAX_REDIRECT_ATTEMPTS = 2;
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      const userRoles = await UserService.getUserRoles(userId);
      return userRoles;
    } catch (err) {
      console.error("Error fetching user roles in AuthTransitionWrapper:", err);
      return [];
    }
  };

  useEffect(() => {
    if (!mounted) return;
    
    // Wait for user auth to be initialized before proceeding
    if (!initialized || userLoading) {
      console.log("AuthTransitionWrapper: Waiting for auth initialization...");
      return;
    }

    // If no auth required and no roles to check, render immediately
    if (!requireAuth && !allowedRoles.length) {
      console.log("AuthTransitionWrapper: No auth required, rendering content");
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
      
      // First see if we have roles from the hook
      let userRoles = roles;
      
      // If roles are loading or empty, try fetching directly
      if ((rolesLoading || roles.length === 0) && allowedRoles.length > 0) {
        setMessage("Checking your permissions...");
        userRoles = await fetchUserRoles(user.id);
      }
      
      // Check roles if needed
      if (allowedRoles.length > 0) {
        const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role));
        
        if (!hasAllowedRole) {
          console.log("AuthTransitionWrapper: User lacks required role, redirecting");
          setMessage("Redirecting to appropriate page...");
          redirectAttemptsRef.current += 1;
          
          const redirectPath = getRedirectPageForRoles(userRoles);
          
          // Use timeout to avoid interrupting render
          redirectTimeoutRef.current = setTimeout(() => {
            if (mounted) {
              navigate(redirectPath, { replace: true });
            }
          }, 100);
          return false;
        }
      }
      
      return true;
    };
    
    const processAuthentication = async () => {
      if (user) {
        const roleCheckPassed = await checkUserRoles();
        if (roleCheckPassed) {
          console.log("AuthTransitionWrapper: User is authorized, showing content");
          setIsTransitioning(false);
        }
      }
    };
    
    processAuthentication();
    
  }, [user, roles, rolesLoading, requireAuth, redirectTo, navigate, allowedRoles, mounted, initialized, userLoading, refetch]);

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
