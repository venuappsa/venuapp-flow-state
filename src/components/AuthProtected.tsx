
import { ReactNode, useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import RedirectLoaderOverlay from "./RedirectLoaderOverlay";

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
  const { user, loading: userLoading } = useUser();
  const { data: roles = [], isLoading: rolesLoading, refetch } = useUserRoles(user?.id);
  const [retryCount, setRetryCount] = useState(0);
  const [checkingRoles, setCheckingRoles] = useState(false);
  
  // For debugging
  useEffect(() => {
    console.log("AuthProtected: user:", user?.id);
    console.log("AuthProtected: roles:", roles);
    console.log("AuthProtected: userLoading:", userLoading);
    console.log("AuthProtected: rolesLoading:", rolesLoading);
    console.log("AuthProtected: requiredRoles:", requiredRoles);
  }, [user, roles, userLoading, rolesLoading, requiredRoles]);
  
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
  if (userLoading || rolesLoading || checkingRoles) {
    return <RedirectLoaderOverlay message="Checking authorization..." />;
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    console.log("AuthProtected: No user found, redirecting to login");
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
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
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
  }
  
  console.log("AuthProtected: User is authorized, rendering content");
  
  // If children are provided, render them; otherwise render the Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default AuthProtected;
