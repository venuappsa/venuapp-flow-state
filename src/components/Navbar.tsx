import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
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

// Use the newly uploaded logo. Ensure path correctness.
const VENUAPP_LOGO_SRC = "/lovable-uploads/00295b81-909c-4b6d-b67d-6638afdd5ba3.png";

export default function Navbar() {
  const { user } = useUser();
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
        {/* Logo and Brand on left */}
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
        {/* Menu items on right */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/#about"
            className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-xs sm:text-sm font-medium"
          >
            About
          </Link>
          {/* Features Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-xs sm:text-sm font-medium hover:bg-gray-100 focus:outline-none data-[state=open]:bg-gray-200">
              Features <ChevronDown size={14} className="ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-white min-w-[10rem]">
              <DropdownMenuItem asChild>
                <Link to="/customer" className="text-xs sm:text-sm w-full block">
                  Customer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/merchant" className="text-xs sm:text-sm w-full block">
                  Merchant
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/fetchman" className="text-xs sm:text-sm w-full block">
                  Fetchman
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                {/* This links to the Host explainer page, NOT a login */}
                <Link to="/host" className="text-xs sm:text-sm w-full block">
                  Host
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/#pricing"
            className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-xs sm:text-sm font-medium"
          >
            Pricing
          </Link>
          <Link
            to="/#contact"
            className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-xs sm:text-sm font-medium"
          >
            Contact
          </Link>
          <Link
            to="/subscribe"
            className="text-gray-700 hover:text-black px-2 py-1 rounded transition-colors text-xs sm:text-sm font-medium"
          >
            Subscribe
          </Link>
          {/* User button (Login/Logout) */}
          {!user && (
            <Button
              asChild
              className="ml-2 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4"
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
              className="ml-2 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4"
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
