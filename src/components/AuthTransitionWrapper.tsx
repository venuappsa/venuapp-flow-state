import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import RedirectLoaderOverlay from "@/components/RedirectLoaderOverlay";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";

interface AuthTransitionWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function AuthTransitionWrapper({ 
  children, 
  requireAuth = false,
  allowedRoles = [],
  redirectTo = "/auth"
}: AuthTransitionWrapperProps) {
  const { user } = useUser();
  const { data: roles, isLoading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    let mounted = true;

    const checkAuthAndRedirect = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!mounted) return;

        if (requireAuth && !user) {
          setMessage("Redirecting to login...");
          navigate(redirectTo, { replace: true });
          return;
        }

        if (!rolesLoading && roles && allowedRoles.length > 0) {
          const hasAllowedRole = roles.some(role => allowedRoles.includes(role));
          if (!hasAllowedRole) {
            console.log("User lacks required role, redirecting...");
            setMessage("Redirecting to appropriate page...");
            const redirectPath = getRedirectPageForRoles(roles);
            navigate(redirectPath, { replace: true });
            return;
          }
        }

        setIsTransitioning(false);

      } catch (error) {
        console.error("Auth transition error:", error);
        setIsTransitioning(false);
      }
    };

    checkAuthAndRedirect();

    return () => {
      mounted = false;
    };
  }, [user, roles, rolesLoading, requireAuth, redirectTo, navigate, allowedRoles]);

  if (isTransitioning) {
    return <RedirectLoaderOverlay message={message} />;
  }

  return <>{children}</>;
}
