
import { ReactNode, useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import RedirectLoaderOverlay from "./RedirectLoaderOverlay";
import { supabase } from "@/integrations/supabase/client";

interface AuthProtectedProps {
  children?: ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

const AuthProtected = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = "/auth" 
}: AuthProtectedProps) => {
  const location = useLocation();
  const { user, loading: userLoading, initialized } = useUser();
  const { data: roles = [], isLoading: rolesLoading, refetch } = useUserRoles(user?.id);
  const [retryCount, setRetryCount] = useState(0);
  const [checkingRoles, setCheckingRoles] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // For debugging
  useEffect(() => {
    console.group("AuthProtected Debug Info");
    console.log("Path:", location.pathname);
    console.log("User ID:", user?.id);
    console.log("User Initialized:", initialized);
    console.log("User Roles:", roles);
    console.log("Required Roles:", requiredRoles);
    console.log("Loading States - User:", userLoading, "Roles:", rolesLoading, "Checking:", checkingRoles, "Session:", checkingSession);
    console.log("Retry Count:", retryCount);
    console.log("Authentication State:", isAuthenticated);
    
    const hasRequiredRole = requiredRoles.length === 0 || 
      (Array.isArray(roles) && requiredRoles.some(role => roles.includes(role)));
    
    console.log("Has Required Role:", hasRequiredRole);
    console.groupEnd();
  }, [user, roles, userLoading, rolesLoading, requiredRoles, location.pathname, retryCount, checkingRoles, initialized, checkingSession, isAuthenticated]);
  
  // Check for active session directly when component mounts
  useEffect(() => {
    if (!initialized) return;
    
    const checkSession = async () => {
      try {
        console.log("AuthProtected: Verifying session via direct check");
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("AuthProtected: Session check error:", error);
          throw error;
        }
        
        const hasSession = !!data.session;
        console.log("AuthProtected: Direct session check result:", hasSession);
        setIsAuthenticated(hasSession);
        
        if (!hasSession) {
          console.log("AuthProtected: No active session found");
        } else {
          // If we have a session but no user in state, update the user state
          if (!user && data.session?.user) {
            console.log("AuthProtected: Session found but no user in state, should be handled by useUser hook");
          }
        }
      } catch (err) {
        console.error("AuthProtected: Error checking session:", err);
        setIsAuthenticated(false);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkSession();
  }, [initialized, user]);
  
  // If roles are empty but user exists, retry fetching roles a few times
  useEffect(() => {
    if (
      user && 
      !userLoading && 
      !rolesLoading && 
      requiredRoles.length > 0 && 
      Array.isArray(roles) && 
      roles.length === 0 &&
      retryCount < 3 && 
      !checkingRoles
    ) {
      console.log(`AuthProtected: No roles found for user ${user.id}, retrying... (${retryCount + 1}/3)`);
      setCheckingRoles(true);
      
      const timer = setTimeout(() => {
        refetch();
        setRetryCount(retryCount + 1);
        setCheckingRoles(false);
      }, 1000); // Wait a second between retries
      
      return () => clearTimeout(timer);
    }
  }, [user, userLoading, rolesLoading, roles, retryCount, requiredRoles, refetch]);
  
  // Show loading state while auth is being checked
  if (userLoading || checkingSession || (!initialized && !user) || isAuthenticated === null) {
    return <RedirectLoaderOverlay message="Checking authentication..." />;
  }
  
  // If roles are required and still loading, show loading state
  if (requiredRoles.length > 0 && (rolesLoading || checkingRoles)) {
    return <RedirectLoaderOverlay message="Checking permissions..." />;
  }
  
  // If user is not logged in, redirect to login
  if (!user || isAuthenticated === false) {
    console.log("AuthProtected: No user found, redirecting to login");
    // Include the current path as the 'next' parameter for redirect after login
    const loginRedirectUrl = `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}next=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={loginRedirectUrl} state={{ from: location }} replace />;
  }
  
  // If specific roles are required, check if user has at least one of them
  if (requiredRoles.length > 0) {
    const userRoles = Array.isArray(roles) ? roles : [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    console.log("AuthProtected: User roles:", userRoles);
    console.log("AuthProtected: Required roles:", requiredRoles);
    console.log("AuthProtected: Has required role:", hasRequiredRole);
    
    if (!hasRequiredRole) {
      console.log("AuthProtected: User lacks required role, redirecting to:", redirectTo);
      // Add information about the required role to the redirect URL
      const roleRedirectUrl = `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}required=${requiredRoles.join(',')}&next=${encodeURIComponent(location.pathname)}`;
      return <Navigate to={roleRedirectUrl} state={{ from: location }} replace />;
    }
  }
  
  console.log("AuthProtected: User is authorized, rendering content");
  
  // If children are provided, render them; otherwise render the Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default AuthProtected;
