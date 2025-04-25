
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns true while we are checking initial user auth state.
 * Ends as soon as we have determined logged in/out status.
 */
const useAuthLoadingState = () => {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(() => {
      if (isMounted) setAuthLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return authLoading;
};

export default useAuthLoadingState;
