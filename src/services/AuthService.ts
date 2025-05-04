
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Centralized authentication service to handle all auth-related operations
 */
export const AuthService = {
  /**
   * Authenticate a user with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Promise with success status and user data or error
   */
  loginUser: async (email: string, password: string) => {
    try {
      console.log("AuthService: Attempting to sign in user with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("AuthService: Error during sign in:", error);
        
        // Show user-friendly error message
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive"
        });
        
        return { success: false, error: error.message };
      }
      
      console.log("AuthService: User signed in successfully:", data.user?.id);
      
      return { success: true, data: data.user };
    } catch (e: any) {
      console.error("AuthService: Exception during sign in process:", e);
      
      // Show user-friendly error message for unexpected errors
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      
      return { success: false, error: e.message || "Unexpected error" };
    }
  },
  
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
  
  /**
   * Register a new user with email and password
   * @param email User's email address
   * @param password User's password
   * @param userData Optional additional user data
   * @returns Promise with success status and user data or error
   */
  registerUser: async (email: string, password: string, userData?: Record<string, any>) => {
    try {
      console.log("AuthService: Attempting to register user with email:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        console.error("AuthService: Error during registration:", error);
        
        // Show user-friendly error message
        toast({
          title: "Registration failed",
          description: error.message || "Please check your information and try again.",
          variant: "destructive"
        });
        
        return { success: false, error: error.message };
      }
      
      console.log("AuthService: User registered successfully:", data.user?.id);
      
      return { success: true, data: data.user };
    } catch (e: any) {
      console.error("AuthService: Exception during registration process:", e);
      
      // Show user-friendly error message for unexpected errors
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      
      return { success: false, error: e.message || "Unexpected error" };
    }
  },
  
  /**
   * Check if the current user's session is valid
   * @returns Promise with boolean indicating if session is valid
   */
  isSessionValid: async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("AuthService: Error checking session:", error);
        return false;
      }
      
      return !!data.session;
    } catch (e) {
      console.error("AuthService: Exception checking session:", e);
      return false;
    }
  },

  /**
   * Attempt to refresh the user's session
   * @returns Promise<boolean> indicating if refresh was successful
   */
  refreshSession: async (): Promise<boolean> => {
    try {
      console.log("AuthService: Attempting to refresh session");
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("AuthService: Error refreshing session:", error);
        return false;
      }
      
      return !!data.session;
    } catch (e) {
      console.error("AuthService: Exception refreshing session:", e);
      return false;
    }
  },
  
  /**
   * Handle 404 errors during authentication redirects
   * @param targetPath The path that caused a 404
   * @returns A safe fallback path
   */
  handleAuthRedirect404: (targetPath: string): string => {
    console.log("AuthService: Handling potential 404 redirect for path:", targetPath);
    
    // Extract the base path
    const basePath = targetPath.split('/')[1];
    
    // Map to known valid routes
    const validRouteMap: Record<string, string> = {
      'admin': '/admin',
      'host': '/host',
      'vendor': '/vendor',
      'fetchman': '/fetchman',
      'customer': '/'
    };
    
    const safeRoute = validRouteMap[basePath] || '/';
    
    // Log and return safe route
    if (safeRoute !== targetPath) {
      console.log(`AuthService: Redirecting from potentially invalid route '${targetPath}' to safe route '${safeRoute}'`);
    }
    
    return safeRoute;
  }
};
