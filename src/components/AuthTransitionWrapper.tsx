
import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import RedirectLoaderOverlay from "@/components/RedirectLoaderOverlay";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";
import { Skeleton } from "@/components/ui/skeleton";

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
  redirectTo = "/auth",
  showFallback = true
}: AuthTransitionWrapperProps) {
  const { user } = useUser();
  const { data: roles = [], isLoading: rolesLoading, isError: rolesError } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [message, setMessage] = useState("Loading...");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let redirectTimer: NodeJS.Timeout;
    
    const checkAuthAndRedirect = async () => {
      // If no auth required and no roles to check, render immediately
      if (!requireAuth && !allowedRoles.length) {
        setIsTransitioning(false);
        return;
      }

      // Handle no user case
      if (requireAuth && !user) {
        console.log("AuthTransitionWrapper: No user found, redirecting to login");
        setMessage("Please log in to continue...");
        navigate(redirectTo, { replace: true });
        return;
      }

      // Wait for roles to load if needed
      if (user && rolesLoading) {
        console.log("AuthTransitionWrapper: Waiting for roles to load...");
        return;
      }

      // Check roles if needed
      if (user && !rolesLoading && allowedRoles.length > 0) {
        const userRoles = Array.isArray(roles) ? roles : [];
        const hasAllowedRole = userRoles.some(role => allowedRoles.includes(role));
        
        if (!hasAllowedRole) {
          console.log("AuthTransitionWrapper: User lacks required role");
          setMessage("Redirecting to appropriate page...");
          const redirectPath = getRedirectPageForRoles(userRoles);
          
          redirectTimer = setTimeout(() => {
            if (mounted) {
              navigate(redirectPath, { replace: true });
            }
          }, 100);
          return;
        }
      }
      
      // If we get here, user is authorized
      setIsTransitioning(false);
    };

    checkAuthAndRedirect();
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [user, roles, rolesLoading, requireAuth, redirectTo, navigate, allowedRoles, mounted]);

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
