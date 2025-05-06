
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useUserRoles } from '@/hooks/useUserRoles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { user, initialized } = useUser();
  const location = useLocation();
  const { data: userRoles = [], isLoading: rolesLoading } = useUserRoles(user?.id);

  // Still loading authentication state
  if (!initialized || rolesLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Not logged in - redirect to auth page
  if (!user) {
    console.log("ProtectedRoute: User not authenticated, redirecting to login");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If there are role restrictions
  if (allowedRoles.length > 0) {
    // Check if user has any of the required roles
    const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));
    
    if (!hasRequiredRole) {
      console.log(`ProtectedRoute: User doesn't have required roles (${allowedRoles.join(', ')})`);
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
