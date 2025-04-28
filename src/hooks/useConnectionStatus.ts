
import { useEffect, useState } from "react";
import { checkSupabaseConnection } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    const connected = await checkSupabaseConnection();
    setIsConnected(connected);
    setIsChecking(false);
    
    return connected;
  };

  useEffect(() => {
    checkConnection();

    // Set up periodic connection checks
    const interval = setInterval(() => {
      checkConnection();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return { isConnected, isChecking, checkConnection };
};

export default useConnectionStatus;
