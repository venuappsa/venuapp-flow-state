import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";
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
    <nav className="w-full px-4 py-2 flex items-center gap-3 border-b bg-white shadow">
      <Link to="/" className="font-bold text-lg text-black">Venuapp</Link>
      <div className="flex-1" />
      {roles?.includes("admin") && <Link to="/admin" className="mr-2">Admin Panel</Link>}
      {roles?.includes("host") && <Link to="/host" className="mr-2">Host Panel</Link>}
      {!user && <Button asChild><Link to="/auth">Login</Link></Button>}
      {user && (
        <Button variant="outline" onClick={logOut} disabled={loading}>
          {loading ? "Logging out..." : "Logout"}
        </Button>
      )}
    </nav>
  );
}
