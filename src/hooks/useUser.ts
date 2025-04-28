
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUser = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let lastAuthEvent = '';
    
    // Debounce flag to prevent multiple rapid state changes
    let debounceTimer: NodeJS.Timeout | null = null;
    
    // Setup auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("useUser: onAuthStateChange event:", event, "session:", newSession?.user?.id);
      
      // Prevent duplicate events in quick succession
      if (lastAuthEvent === event && Date.now() - (lastAuthEvent ? 300 : 0) < 500) {
        console.log("useUser: Skipping duplicate auth event");
        return;
      }
      
      // Clear any pending debounce timer
      if (debounceTimer) clearTimeout(debounceTimer);
      
      // Debounce state updates
      debounceTimer = setTimeout(() => {
        if (!isMounted) return;
        
        lastAuthEvent = event;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Failsafe: If signOut, force clear state
        if (event === "SIGNED_OUT" || !newSession) {
          setSession(null);
          setUser(null);
          console.log("useUser: Reset session/user to null after SIGNED_OUT event");
        }
        
        setInitialized(true);
      }, 100);
    });

    // Force check session at mount, but only once
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      
      console.log("useUser: Initial session check -", data.session?.user?.id);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setInitialized(true);
    });

    return () => {
      isMounted = false;
      if (debounceTimer) clearTimeout(debounceTimer);
      subscription.unsubscribe();
    };
  }, []);

  // Manual clear function as a fallback
  function forceClearUser() {
    setSession(null);
    setUser(null);
    console.log("useUser: forceClearUser() called; session and user reset to null");
  }

  return { session, user, forceClearUser, initialized };
};
