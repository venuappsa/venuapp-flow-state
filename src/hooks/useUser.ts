
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUser = () => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let lastAuthEvent = '';
    
    // Use a timeout reference to properly clear debounce timers
    let debounceTimer: NodeJS.Timeout | null = null;
    
    // Track last update time to prevent rapid changes
    let lastUpdateTime = 0;
    const MIN_UPDATE_INTERVAL = 800; // ms
    
    console.log("useUser: Setting up auth state listener");
    
    // Set up auth state listener FIRST - this is critical for proper auth state handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("useUser: onAuthStateChange event:", event, "session:", newSession?.user?.id);
      
      // Don't process duplicate events within cooldown period
      const now = Date.now();
      if (event === lastAuthEvent && now - lastUpdateTime < MIN_UPDATE_INTERVAL) {
        console.log(`useUser: Skipping duplicate auth event '${event}' during cooldown`);
        return;
      }
      
      // Clear any pending debounce timer
      if (debounceTimer) {
        console.log("useUser: Clearing pending debounce timer");
        clearTimeout(debounceTimer);
      }
      
      // Debounce state updates with longer timeout
      debounceTimer = setTimeout(() => {
        if (!isMounted) {
          console.log("useUser: Component unmounted, skipping update");
          return;
        }
        
        console.log(`useUser: Processing '${event}' event after debounce`);
        lastAuthEvent = event;
        lastUpdateTime = Date.now();
        
        if (event === "SIGNED_OUT") {
          // Immediate clear for sign out events
          console.log("useUser: SIGNED_OUT - clearing session/user");
          setSession(null);
          setUser(null);
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          setSession(newSession);
          setUser(newSession?.user ?? null);
        }
        
        // Mark initialization complete
        if (!initialized) {
          setInitialized(true);
        }
        
        // Set loading state to false
        setLoading(false);
      }, 200); // longer debounce to allow for auth state to settle
    });

    // THEN check for existing session but only after listener is set up
    const checkInitialSession = async () => {
      try {
        console.log("useUser: Checking initial session");
        const { data } = await supabase.auth.getSession();
        
        if (!isMounted) {
          console.log("useUser: Component unmounted during initial session check");
          return;
        }
        
        console.log("useUser: Initial session check -", data.session?.user?.id);
        
        // Only update if we have different values to prevent unnecessary renders
        const hasUser = !!data.session?.user;
        const currentHasUser = !!user;
        
        if (hasUser !== currentHasUser) {
          console.log("useUser: Updating initial session state");
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
        
        // Mark initialization and loading as complete
        setInitialized(true);
        setLoading(false);
      } catch (error) {
        console.error("useUser: Error during initial session check:", error);
        if (isMounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };
    
    // Delay session check slightly to ensure listener is set up first
    setTimeout(checkInitialSession, 50);

    return () => {
      console.log("useUser: Cleanup - unsubscribing and clearing timers");
      isMounted = false;
      if (debounceTimer) clearTimeout(debounceTimer);
      subscription.unsubscribe();
    };
  }, []);

  // Manual clear function as a fallback - now uses local state only
  const forceClearUser = () => {
    console.log("useUser: forceClearUser called - manually clearing auth state");
    setSession(null);
    setUser(null);
  };

  return { session, user, forceClearUser, initialized, loading };
};
