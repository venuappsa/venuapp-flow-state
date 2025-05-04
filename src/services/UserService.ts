
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Define the interface for the fetchman profile data
interface FetchmanProfileData {
  vehicle_type: string;
  work_hours: string;
  service_area: string;
  phone_number: string;
  identity_number: string;
  has_own_transport: boolean;
  bank_account_number: string;
  bank_name: string;
  branch_code: string;
}

// Define the interface for registration data
interface RegistrationData {
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

export const UserService = {
  /**
   * Get roles for a specific user directly from the database
   * @param userId The user ID to fetch roles for
   * @returns Array of role strings
   */
  getUserRoles: async (userId: string): Promise<string[]> => {
    console.log("UserService: Fetching roles for user:", userId);
    
    if (!userId) {
      console.warn("UserService: No user ID provided for role lookup");
      return [];
    }

    try {
      // First attempt with normal client
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
        
      if (error) {
        console.error("UserService: Error fetching roles:", error);
        throw error;
      }
      
      const roles = data?.map((r: { role: string }) => r.role) || [];
      console.log("UserService: Fetched roles:", roles);
      return roles;
    } catch (initialError) {
      console.error("UserService: Initial error fetching roles:", initialError);
      
      // Try refreshing the session and fetching again
      try {
        console.log("UserService: Attempting to refresh session");
        const { data: refreshData } = await supabase.auth.refreshSession();
        
        if (refreshData.session) {
          console.log("UserService: Session refreshed, retrying role fetch");
          
          // Try again with refreshed session
          const { data: retryData, error: retryError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userId);
            
          if (retryError) {
            console.error("UserService: Error after session refresh:", retryError);
            throw retryError;
          }
          
          const retryRoles = retryData?.map((r: { role: string }) => r.role) || [];
          console.log("UserService: Fetched roles after refresh:", retryRoles);
          return retryRoles;
        } else {
          console.warn("UserService: Session refresh returned no session");
          return [];
        }
      } catch (refreshError) {
        console.error("UserService: Error refreshing session:", refreshError);
        return [];
      }
    }
  },
  
  /**
   * Check if the current user has admin role
   */
  isUserAdmin: async (): Promise<boolean> => {
    try {
      console.log("UserService: Checking if current user is admin");
      
      // Use the RPC function we created in the database
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error("UserService: Error checking admin status:", error);
        return false;
      }
      
      console.log("UserService: Admin check result:", data);
      return !!data;
    } catch (error) {
      console.error("UserService: Exception checking admin status:", error);
      return false;
    }
  },
  
  /**
   * Get the current user's session
   */
  getCurrentSession: async (): Promise<Session | null> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("UserService: Error getting session:", error);
        return null;
      }
      
      return data.session;
    } catch (error) {
      console.error("UserService: Exception getting session:", error);
      return null;
    }
  },
  
  /**
   * Force refresh the current user's session
   */
  refreshUserSession: async (): Promise<Session | null> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("UserService: Error refreshing session:", error);
        return null;
      }
      
      return data.session;
    } catch (error) {
      console.error("UserService: Exception refreshing session:", error);
      return null;
    }
  },

  /**
   * Login user with email and password
   * @param email User email
   * @param password User password
   * @returns Result object with success status and error/user data
   */
  loginUser: async (email: string, password: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("UserService: Attempting login for email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("UserService: Login error:", error.message);
        return { 
          success: false, 
          error: error.message 
        };
      }
      
      console.log("UserService: Login successful for user:", data.user.id);
      return { 
        success: true, 
        data: data.user 
      };
    } catch (error: any) {
      console.error("UserService: Exception during login:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred during login." 
      };
    }
  },

  /**
   * Register a new user
   * @param email User email
   * @param password User password
   * @param userData Additional user data
   * @returns Result object with success status and error/user data
   */
  registerUser: async (email: string, password: string, userData: RegistrationData): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("UserService: Registering new user with email:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            role: userData.role
          }
        }
      });
      
      if (error) {
        console.error("UserService: Registration error:", error.message);
        return { 
          success: false, 
          error: error.message 
        };
      }
      
      if (data.user) {
        console.log("UserService: User registered successfully, creating profile and role");
        
        try {
          // Create user profile
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              name: userData.firstName,
              surname: userData.lastName,
              phone: userData.phone,
              email: email
            });
            
          if (profileError) {
            console.error("UserService: Error creating profile:", profileError);
          }
          
          // Create user role
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({
              user_id: data.user.id,
              role: userData.role
            });
            
          if (roleError) {
            console.error("UserService: Error creating user role:", roleError);
          }
        } catch (setupError: any) {
          console.error("UserService: Error setting up user data:", setupError);
          // We don't return error here since the user is created successfully
        }
        
        return { 
          success: true, 
          data: data.user 
        };
      } else {
        return { 
          success: false, 
          error: "User registration did not return a user." 
        };
      }
    } catch (error: any) {
      console.error("UserService: Exception during registration:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred during registration." 
      };
    }
  },

  /**
   * Create or update a fetchman profile
   * @param userId User ID
   * @param profileData Fetchman profile data
   * @returns Result object with success status and error message if applicable
   */
  createFetchmanProfile: async (userId: string, profileData: FetchmanProfileData): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("UserService: Creating/updating fetchman profile for user:", userId);
      
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('fetchman_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("UserService: Error checking fetchman profile:", checkError);
        return { success: false, error: checkError.message };
      }
      
      let result;
      
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('fetchman_profiles')
          .update({
            vehicle_type: profileData.vehicle_type,
            work_hours: profileData.work_hours,
            service_area: profileData.service_area,
            phone_number: profileData.phone_number,
            identity_number: profileData.identity_number,
            has_own_transport: profileData.has_own_transport,
            bank_account_number: profileData.bank_account_number,
            bank_name: profileData.bank_name,
            branch_code: profileData.branch_code,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
          
        if (updateError) {
          console.error("UserService: Error updating fetchman profile:", updateError);
          return { success: false, error: updateError.message };
        }
        
        result = { success: true };
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('fetchman_profiles')
          .insert({
            user_id: userId,
            vehicle_type: profileData.vehicle_type,
            work_hours: profileData.work_hours,
            service_area: profileData.service_area,
            phone_number: profileData.phone_number,
            identity_number: profileData.identity_number,
            has_own_transport: profileData.has_own_transport,
            bank_account_number: profileData.bank_account_number,
            bank_name: profileData.bank_name,
            branch_code: profileData.branch_code
          });
          
        if (insertError) {
          console.error("UserService: Error creating fetchman profile:", insertError);
          return { success: false, error: insertError.message };
        }
        
        // Try to add the fetchman role if not already present
        try {
          const { data: existingRoles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userId);
            
          const roles = existingRoles?.map(r => r.role) || [];
          
          if (!roles.includes('fetchman')) {
            const { error: roleError } = await supabase
              .from("user_roles")
              .insert({
                user_id: userId,
                role: 'fetchman'
              });
              
            if (roleError) {
              console.error("UserService: Error adding fetchman role:", roleError);
            }
          }
        } catch (roleError) {
          console.error("UserService: Exception adding fetchman role:", roleError);
          // Don't return failure here, since the profile was created successfully
        }
        
        result = { success: true };
      }
      
      return result;
    } catch (error: any) {
      console.error("UserService: Exception creating/updating fetchman profile:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  }
};
