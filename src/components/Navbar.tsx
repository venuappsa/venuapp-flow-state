import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNavMenu from "./MobileNavMenu";
import { toast } from "@/components/ui/use-toast";
import { useUserRoles } from "@/hooks/useUserRoles";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";
import SecurePanelButton from "./SecurePanelButton";
import { Button } from "@/components/ui/button";

const VENUAPP_LOGO_SRC = "/lovable-uploads/00295b81-909c-4b6d-b67d-6638afdd5ba3.png";

export default function Navbar() {
  const { user, forceClearUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState<string | null>(null);

  const { data: userRoles, isLoading: rolesLoading } = useUserRoles(user?.id);

  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logOut = async () => {
    setLoading(true);
    setLogoutStatus("Attempting to log you out...");
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
      await supabase.auth.getSession().then(({ data }) => {});
      if (error) {
        setLogoutStatus("Logout failed. Please close and reopen the app.");
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setLogoutStatus("You were logged out successfully. Reloading...");
        toast({ title: "Logged out!" });
      }
    } catch (e: any) {
      setLogoutStatus("Logout failed. Please close and reopen the app.");
      toast({
        title: "Logout failed",
        description: e.message,
        variant: "destructive"
      });
    }
    setLoading(false);
    setTimeout(() => {
      navigate("/auth", { replace: true });
      window.location.reload();
    }, 900);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavLink = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      scrollToSection(sectionId);
    } else {
      navigate("/", { replace: false });
      setTimeout(() => scrollToSection(sectionId), 100);
    }
    if (isMobile) setMobileMenuOpen(false);
  };

  // Determine subscription link based on authentication status
  const subscriptionLink = user ? "/host/subscription" : "/subscribe";

  // Always show SecurePanelButton for all users; it switches text based on auth state.
  return (
    <nav className="w-full border-b bg-white shadow z-50 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center px-4 py-1 sm:py-2">
        <Link
          to="/"
          className="flex items-center font-bold text-lg text-black gap-2"
          style={{ minWidth: 0 }}
        >
          <img
            src={VENUAPP_LOGO_SRC}
            alt="Venuapp Logo"
            className="h-8 w-auto mr-1"
            style={{ maxWidth: 36 }}
          />
          <span className="whitespace-nowrap text-sm sm:text-base tracking-tight font-extrabold">
            Venuapp
          </span>
        </Link>
        <div className="flex-1" />
        {!isMobile && (
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleNavLink("about")}
              className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-xs sm:text-sm font-medium bg-transparent"
              style={{ background: "none", border: "none" }}
            >
              About
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-xs sm:text-sm font-medium hover:bg-gray-100 focus:outline-none data-[state=open]:bg-gray-200">
                Features <ChevronDown size={14} className="ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 bg-white min-w-[10rem]">
                <DropdownMenuItem asChild>
                  <Link to="/features/attendee" className="text-xs sm:text-sm w-full block">
                    Attendee
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/features/merchant" className="text-xs sm:text-sm w-full block">
                    Merchant
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/features/fetchman" className="text-xs sm:text-sm w-full block">
                    Fetchman
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/features/host" className="text-xs sm:text-sm w-full block">
                    Host
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={handleNavLink("pricing")}
              className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-xs sm:text-sm font-medium bg-transparent"
              style={{ background: "none", border: "none" }}
            >
              Pricing
            </button>
            <button
              onClick={handleNavLink("contact")}
              className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-xs sm:text-sm font-medium bg-transparent"
              style={{ background: "none", border: "none" }}
            >
              Contact
            </button>
            <Link
              to={subscriptionLink}
              className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-xs sm:text-sm font-medium"
            >
              Subscribe
            </Link>
            <SecurePanelButton showWelcome className="flex flex-col items-center" />
          </div>
        )}
        {isMobile && (
          <MobileNavMenu
            onNavLink={handleNavLink}
            isOpen={mobileMenuOpen}
            setIsOpen={setMobileMenuOpen}
          />
        )}
        {logoutStatus && (
          <div
            className="fixed bottom-14 left-0 right-0 z-[200] bg-venu-orange text-white py-3 px-4 text-center font-bold text-base rounded shadow animate-in fade-in"
            style={{ margin: "0 auto", maxWidth: 320 }}
          >
            {logoutStatus}
          </div>
        )}
      </div>
    </nav>
  );
}
