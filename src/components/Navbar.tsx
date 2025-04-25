
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export default function Navbar() {
  const { user } = useUser();
  const { data: roles } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    navigate("/auth");
  };

  return (
    <nav className="w-full border-b bg-white shadow z-50 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center px-4 py-1 sm:py-2">
        {/* Logo and Brand */}
        <Link
          to="/"
          className="flex items-center font-bold text-xl text-black gap-2"
          style={{ minWidth: 0 }}
        >
          <img
            src="/lovable-uploads/57c16116-eacd-44f2-8cd4-b65aab317ae7.png"
            alt="Venuapp Logo"
            className="h-8 w-auto mr-1"
            style={{ maxWidth: 36 }}
          />
          <span className="whitespace-nowrap text-lg sm:text-xl tracking-tight font-extrabold">
            Venuapp
          </span>
        </Link>
        <div className="flex-1" />

        {/* Menu */}
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="#about"
            className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-sm sm:text-base"
          >
            About
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-sm sm:text-base font-normal hover:bg-gray-100 focus:outline-none data-[state=open]:bg-gray-200">
              Features <ChevronDown size={16} className="ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-white min-w-[9rem]">
              <DropdownMenuItem asChild>
                <Link to="/customer" className="text-sm">Customer</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/merchant" className="text-sm">Merchant</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/fetchman" className="text-sm">Fetchman</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/host" className="text-sm">Host</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <a
            href="#pricing"
            className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-sm sm:text-base"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-sm sm:text-base"
          >
            Contact
          </a>
          <a
            href="#subscribe"
            className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-sm sm:text-base"
          >
            Subscribe
          </a>
          {/* Remove admin and host panels from nav, only panel links if needed for secure user roles */}
          {!user && (
            <Button
              asChild
              className="ml-2 text-sm sm:text-base font-semibold px-3 py-1.5 sm:px-4"
              variant="secondary"
            >
              <Link to="/auth">Login</Link>
            </Button>
          )}
          {user && (
            <Button
              variant="outline"
              onClick={logOut}
              disabled={loading}
              className="ml-2 text-sm sm:text-base font-semibold px-3 py-1.5 sm:px-4"
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
