
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

interface SecurePanelButtonProps {
  className?: string;
  showWelcome?: boolean;
}

export default function SecurePanelButton({ className, showWelcome }: SecurePanelButtonProps) {
  const { user, forceClearUser } = useUser();
  const { data: userRoles, isLoading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [panelRoute, setPanelRoute] = useState("/customer");

  // Update panel route whenever roles change
  useEffect(() => {
    if (user && userRoles && !rolesLoading) {
      const route = getRedirectPageForRoles(userRoles);
      setPanelRoute(route);
      console.log("Panel route updated to:", route, "for roles:", userRoles);
    }
  }, [user, userRoles, rolesLoading]);

  const isLoggedIn = !!user;
  const buttonLabel = isLoggedIn 
    ? rolesLoading 
      ? "Loading..." 
      : "Go to Secure Panel" 
    : "Login";

  let displayName = "";
  if (isLoggedIn) {
    displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      user.email ||
      "User";
  }

  const handleButtonClick = () => {
    if (rolesLoading) return;
    
    if (isLoggedIn && userRoles && userRoles.length > 0) {
      console.log("Navigating to panel route:", panelRoute);
      setLoading(true);
      navigate(panelRoute);
      setLoading(false);
    } else {
      navigate("/auth");
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      if (window && window.caches) {
        try {
          window.caches.keys().then(keys => keys.forEach(k => window.caches.delete(k)));
        } catch (e) {}
      }
      if (forceClearUser) forceClearUser();
      if (error) {
        toast({ title: "Logout failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Logged out!" });
      }
      setTimeout(() => {
        navigate("/auth", { replace: true });
        window.location.reload();
      }, 700);
    } catch (e: any) {
      toast({ title: "Logout failed", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className={className ?? ""}>
      <div className="flex items-center gap-2">
        <Button
          className="text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 border border-venu-orange text-venu-orange hover:bg-venu-orange/10 min-w-[100px] justify-center"
          variant="outline"
          onClick={handleButtonClick}
          disabled={rolesLoading || loading}
        >
          {(rolesLoading || loading) ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : buttonLabel}
        </Button>
        {isLoggedIn && (
          <Button
            variant="ghost"
            size="icon"
            className="text-venu-orange hover:text-venu-orange/80 hover:bg-transparent"
            onClick={logOut}
            disabled={loading}
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        )}
      </div>
      {isLoggedIn && showWelcome && (
        <div className="text-[11px] sm:text-xs mt-1 text-gray-500 text-center font-medium">
          Hi, {displayName}, welcome to Venuapp
        </div>
      )}
    </div>
  );
}
