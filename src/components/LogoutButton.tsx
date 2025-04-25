
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";

export default function LogoutButton() {
  const { forceClearUser } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setLoading(false);
    }
  };

  return (
    <Button onClick={logOut} variant="outline" className="text-xs sm:text-sm" disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
