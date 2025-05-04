import { ReactNode, useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import RedirectLoaderOverlay from "./RedirectLoaderOverlay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserService } from "@/services/UserService";

interface AuthProtectedProps {
  children?: ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

const AuthProtected = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = "/" 
}: AuthProtectedProps) => {
  const location = useLocation();
  const { user, loading: userLoading, initialized } = useUser();
  const { data: roles = [], isLoading: rolesLoading, refetch } = useUserRoles(user?.id);
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const [checkingRoles, setCheckingRoles] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const DEBUG_MODE = true; // Enable detailed logging
  
  // For debugging
  useEffect(() => {
    if (DEBUG_MODE) {
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
    }
  }, [user, roles, userLoading, rolesLoading, requiredRoles, location.pathname, retryCount, checkingRoles, initialized, checkingSession, isAuthenticated]);
  
  // Check for active session directly when component mounts
  useEffect(() => {
    if (!initialized) return;
    
    const checkSession = async () => {
      try {
        if (DEBUG_MODE) console.log("AuthProtected: Verifying session via direct check");
        
        // Try getting session via UserService
        const session = await UserService.getCurrentSession();
        const hasSession = !!session;
        
        if (DEBUG_MODE) console.log("AuthProtected: Direct session check result:", hasSession);
        setIsAuthenticated(hasSession);
        
        if (!hasSession) {
          if (DEBUG_MODE) console.log("AuthProtected: No active session found");
          
          // Try refreshing the session
          const refreshedSession = await UserService.refreshUserSession();
          if (refreshedSession) {
            if (DEBUG_MODE) console.log("AuthProtected: Successfully refreshed session");
            setIsAuthenticated(true);
          }
        } else if (!user && session?.user) {
          if (DEBUG_MODE) console.log("AuthProtected: Session found but no user in state, should be handled by useUser hook");
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
      if (DEBUG_MODE) console.log(`AuthProtected: No roles found for user ${user.id}, retrying... (${retryCount + 1}/3)`);
      setCheckingRoles(true);
      
      const timer = setTimeout(async () => {
        // Try direct fetch via UserService
        try {
          const userRoles = await UserService.getUserRoles(user.id);
          if (userRoles.length > 0 && DEBUG_MODE) {
            console.log("AuthProtected: Direct fetch found roles:", userRoles);
          }
        } catch (err) {
          console.error("AuthProtected: Error in direct role fetch:", err);
        }
        
        // Also trigger the hook refetch
        refetch();
        setRetryCount(retryCount + 1);
        setCheckingRoles(false);
      }, 1000); // Wait a second between retries
      
      return () => clearTimeout(timer);
    }
  }, [user, userLoading, rolesLoading, roles, retryCount, requiredRoles, refetch]);
  
  // Direct admin check for admin routes
  useEffect(() => {
    if (
      user && 
      !userLoading && 
      requiredRoles.includes('admin') && 
      !roles.includes('admin') &&
      !checkingRoles
    ) {
      const checkAdminDirectly = async () => {
        if (DEBUG_MODE) console.log("AuthProtected: Checking admin status directly via RPC");
        setCheckingRoles(true);
        
        try {
          const isAdmin = await UserService.isUserAdmin();
          
          if (isAdmin && DEBUG_MODE) {
            console.log("AuthProtected: User is admin according to direct check");
            // Force refetch of roles
            refetch();
          }
        } catch (err) {
          console.error("AuthProtected: Error in direct admin check:", err);
        } finally {
          setCheckingRoles(false);
        }
      };
      
      checkAdminDirectly();
    }
  }, [user, userLoading, requiredRoles, roles, checkingRoles, refetch]);
  
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
    if (DEBUG_MODE) console.log("AuthProtected: No user found, redirecting to login");
    // Include the current path as the 'next' parameter for redirect after login
    const loginRedirectUrl = `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}next=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={loginRedirectUrl} state={{ from: location }} replace />;
  }
  
  // If specific roles are required, check if user has at least one of them
  if (requiredRoles.length > 0) {
    const userRoles = Array.isArray(roles) ? roles : [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (DEBUG_MODE) {
      console.log("AuthProtected: User roles:", userRoles);
      console.log("AuthProtected: Required roles:", requiredRoles);
      console.log("AuthProtected: Has required role:", hasRequiredRole);
    }
    
    if (!hasRequiredRole) {
      console.log("AuthProtected: User lacks required role, redirecting to:", redirectTo);
      toast({
        title: "Access Restricted",
        description: "You don't have permission to access this area.",
        variant: "destructive",
      });
      // Add information about the required role to the redirect URL
      const roleRedirectUrl = `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}required=${requiredRoles.join(',')}&next=${encodeURIComponent(location.pathname)}`;
      return <Navigate to={roleRedirectUrl} state={{ from: location }} replace />;
    }
  }
  
  if (DEBUG_MODE) console.log("AuthProtected: User is authorized, rendering content");
  
  // If children are provided, render them; otherwise render the Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default AuthProtected;
