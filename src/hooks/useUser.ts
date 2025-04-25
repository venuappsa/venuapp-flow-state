
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUser = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log("useUser: onAuthStateChange event:", _event, "session:", session, "user:", session?.user ?? null);
    });

    // THEN get session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      console.log("useUser: getSession check - session:", data.session, "user:", data.session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, user };
};
