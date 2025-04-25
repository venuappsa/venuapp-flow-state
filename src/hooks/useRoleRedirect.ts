
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type AppRole = "admin" | "host" | "merchant" | "customer" | "fetchman";

const ROLE_PRIORITY: AppRole[] = [
  "admin",
  "host",
  "merchant",
  "fetchman",
  "customer",
];

export function getRedirectPageForRoles(roles: string[]): string {
  for (const role of ROLE_PRIORITY) {
    if (roles.includes(role)) {
      switch (role) {
        case "admin":
          return "/admin";
        case "host":
          return "/host";
        case "merchant":
          return "/merchant";
        case "fetchman":
          return "/fetchman";
        case "customer":
          return "/customer";
        default:
          break;
      }
    }
  }
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
  userRoles: string[] | undefined;
  rolesLoading: boolean;
  setPendingRedirect: (v: boolean) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (pendingRedirect && userId && userRoles && !rolesLoading) {
      const rolesArray = userRoles && Array.isArray(userRoles) ? userRoles : [];
      console.log("Detected roles after login on AuthPage:", rolesArray);
      const redirectTo = getRedirectPageForRoles(rolesArray);
      if (redirectTo !== window.location.pathname) {
        navigate(redirectTo, { replace: true });
      }
      setPendingRedirect(false);
    }
  }, [pendingRedirect, userId, userRoles, rolesLoading, navigate, setPendingRedirect]);
}
