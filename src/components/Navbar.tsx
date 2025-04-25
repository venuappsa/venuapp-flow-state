
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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
    <nav className="w-full px-4 py-2 flex items-center gap-6 border-b bg-white shadow z-50 sticky top-0">
      <Link to="/" className="font-bold text-lg text-black">Venuapp</Link>
      <div className="flex gap-3 items-center">
        <a href="#about" className="text-gray-700 hover:text-black px-3 py-1 rounded transition-colors">About</a>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-black px-3 py-1 rounded transition-colors hover:bg-gray-100 focus:outline-none">
            Features <ChevronDown size={16} className="ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="z-50 bg-white">
            <DropdownMenuItem asChild>
              <Link to="/customer">Customer</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/merchant">Merchant</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/fetchman">Fetchman</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/host">Host</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin">Admin</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <a href="#pricing" className="text-gray-700 hover:text-black px-3 py-1 rounded transition-colors">Pricing</a>
        <a href="#contact" className="text-gray-700 hover:text-black px-3 py-1 rounded transition-colors">Contact</a>
        <a href="#subscribe" className="text-gray-700 hover:text-black px-3 py-1 rounded transition-colors">Subscribe</a>
      </div>
      <div className="flex-1" />
      {roles?.includes("admin") && <Link to="/admin" className="mr-2 hidden md:inline">Admin Panel</Link>}
      {roles?.includes("host") && <Link to="/host" className="mr-2 hidden md:inline">Host Panel</Link>}
      {!user && <Button asChild><Link to="/auth">Login</Link></Button>}
      {user && (
        <Button variant="outline" onClick={logOut} disabled={loading}>
          {loading ? "Logging out..." : "Logout"}
        </Button>
      )}
    </nav>
  );
}
