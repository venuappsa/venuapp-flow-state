
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";

interface SecurePanelButtonProps {
  className?: string;
  showWelcome?: boolean;
}

export default function SecurePanelButton({ className, showWelcome }: SecurePanelButtonProps) {
  const { user } = useUser();
  const { data: userRoles, isLoading: rolesLoading } = useUserRoles(user?.id);

  let panelRoute: string = "/customer";
  if (user && userRoles && !rolesLoading && userRoles.length > 0) {
    panelRoute = getRedirectPageForRoles(userRoles);
  }

  // Determine button label and link based on auth state
  const isLoggedIn = !!user;
  const buttonLabel = isLoggedIn ? "Go to Secure Panel" : "Login";
  const buttonLink = isLoggedIn ? panelRoute : "/auth";

  // Get the user's friendly display name (fallback to email if no name)
  let displayName = "";
  if (isLoggedIn) {
    displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      user.email ||
      "User";
  }

  return (
    <div className={className ?? ""}>
      <Button
        asChild
        className="ml-2 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 border border-venu-orange text-venu-orange hover:bg-venu-orange/10"
        variant="outline"
      >
        <Link to={buttonLink}>{buttonLabel}</Link>
      </Button>
      {isLoggedIn && showWelcome && (
        <div className="text-[11px] sm:text-xs mt-1 text-gray-500 text-center font-medium">
          Hi, {displayName}, welcome to Venuapp
        </div>
      )}
    </div>
  );
}

