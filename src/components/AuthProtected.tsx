
import { ReactNode } from "react";
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
  const { user, loading } = useUser();
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles(user?.id);
  
  // Show loading state while auth is being checked
  if (loading || rolesLoading) {
    return <RedirectLoaderOverlay message="Checking authorization..." />;
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // If specific roles are required, check if user has at least one of them
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => roles.includes(role));
    
    if (!hasRequiredRole) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
  }
  
  // If children are provided, render them; otherwise render the Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default AuthProtected;
