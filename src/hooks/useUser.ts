
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUser = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Setup auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log("useUser: onAuthStateChange event:", _event, "session:", session, "user:", session?.user ?? null);

      // Failsafe: If signOut, force clear state (just in case)
      if (_event === "SIGNED_OUT" || !session) {
        setSession(null);
        setUser(null);
        console.log("useUser: Forcing session/user set to null after SIGNED_OUT or missing session");
      }
    });

    // Always force check session at mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      console.log("useUser: getSession check - session:", data.session, "user:", data.session?.user ?? null);
    });

    // Failsafe: Remove listener and clear all state on unmount
    return () => {
      subscription.unsubscribe();
      setSession(null);
      setUser(null);
    };
  }, []);

  // Extra debug
  useEffect(() => {
    console.log("useUser EFFECT: session changed to", session, "user:", user);
  }, [session, user]);

  // Export a manual clear function as a fallback
  function forceClearUser() {
    setSession(null);
    setUser(null);
    console.log("useUser: forceClearUser() called; session and user reset to null");
  }

  return { session, user, forceClearUser };
};
