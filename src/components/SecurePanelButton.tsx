
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";

interface SecurePanelButtonProps {
  className?: string;
}

export default function SecurePanelButton({ className }: SecurePanelButtonProps) {
  const { user } = useUser();
  const { data: userRoles, isLoading: rolesLoading } = useUserRoles(user?.id);

  let panelRoute: string = "/customer";
  if (user && userRoles && !rolesLoading && userRoles.length > 0) {
    panelRoute = getRedirectPageForRoles(userRoles);
  }

  // Hide in secure panel pages if user is logged in (the panel itself will show logout)
  // But display everywhere else
  return (
    <Button
      asChild
      className={`ml-2 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 border border-venu-orange text-venu-orange hover:bg-venu-orange/10 ${className || ""}`}
      variant="outline"
    >
      <Link to={panelRoute}>Go to Secure Panel</Link>
    </Button>
  );
}

