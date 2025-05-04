
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Centralized authentication service to handle all auth-related operations
 */
export const AuthService = {
  /**
   * Sign out the current user with proper error handling
   * @returns Promise<boolean> indicating if sign out was successful
   */
  signOut: async (): Promise<boolean> => {
    try {
      console.log("AuthService: Attempting to sign out user");
      
      // First invalidate the session with Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("AuthService: Error during sign out:", error);
        
        // Show user-friendly error message
        toast({
          title: "Sign out issue",
          description: "We had trouble signing you out. Please try again.",
          variant: "destructive"
        });
        
        return false;
      }
      
      console.log("AuthService: User signed out successfully");
      
      return true;
    } catch (e) {
      console.error("AuthService: Exception during sign out process:", e);
      
      // Show user-friendly error message for unexpected errors
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  },
};
