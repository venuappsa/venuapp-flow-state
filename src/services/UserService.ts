
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Enums } from "@/integrations/supabase/types";

/**
 * Service for managing user accounts, profiles, and roles
 */
export const UserService = {
  /**
   * Register a new user with email and password
   */
  registerUser: async (
    email: string,
    password: string,
    userData: {
      firstName: string;
      lastName: string;
      phone: string;
      role: Enums<"app_role"> | string;
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            full_name: `${userData.firstName} ${userData.lastName}`,
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        return { 
          success: false, 
          error: error.message || "Failed to register. Please try again." 
        };
      }
      
      if (!data.user) {
        return { 
          success: false, 
          error: "No user returned from registration. Please try again." 
        };
      }

      // Create user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: userData.role as Enums<"app_role">
        });

      if (roleError) {
        console.error("Error setting user role:", roleError);
        return { 
          success: false, 
          error: "Account created but failed to set role. Please contact support." 
        };
      }

      // Create profile based on role
      let profileError = null;
      if (userData.role === "host") {
        const { error: hostProfileError } = await supabase
          .from("host_profiles")
          .insert({
            user_id: data.user.id,
            contact_name: `${userData.firstName} ${userData.lastName}`,
            contact_email: email,
            contact_phone: userData.phone
          });
        profileError = hostProfileError;
      } else if (userData.role === "merchant") {
        const { error: vendorProfileError } = await supabase
          .from("vendor_profiles")
          .insert({
            user_id: data.user.id,
            contact_name: `${userData.firstName} ${userData.lastName}`,
            contact_email: email,
            contact_phone: userData.phone
          });
        profileError = vendorProfileError;
      }
      
      // Create general profile
      const { error: generalProfileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          name: userData.firstName,
          surname: userData.lastName,
          phone: userData.phone,
          email: email
        });

      if (profileError || generalProfileError) {
        console.error("Error creating profile:", profileError || generalProfileError);
        return { 
          success: true, 
          data: data.user,
          error: "Account created but profile setup incomplete. Some features may be limited." 
        };
      }

      return { 
        success: true, 
        data: data.user 
      };
    } catch (err: any) {
      console.error("Exception during registration:", err);
      return { 
        success: false, 
        error: err.message || "An unexpected error occurred. Please try again." 
      };
    }
  },

  /**
   * Login a user with email and password
   */
  loginUser: async (
    email: string,
    password: string
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
        return { 
          success: false, 
          error: error.message || "Failed to login. Please check your credentials." 
        };
      }

      if (!data.user) {
        return { 
          success: false, 
          error: "No user returned from login. Please try again." 
        };
      }

      return { 
        success: true, 
        data: data.user 
      };
    } catch (err: any) {
      console.error("Exception during login:", err);
      return { 
        success: false, 
        error: err.message || "An unexpected error occurred. Please try again." 
      };
    }
  },

  /**
   * Fetch user roles from Supabase
   */
  getUserRoles: async (userId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching user roles:", error);
        throw error;
      }

      return data?.map(r => r.role) || [];
    } catch (err) {
      console.error("Exception fetching user roles:", err);
      throw err;
    }
  },

  /**
   * Create a fetchman profile for an existing user
   */
  createFetchmanProfile: async (userId: string, data: {
    vehicle_type: string;
    work_hours: string;
    service_area: string;
    phone_number: string;
    identity_number: string;
    has_own_transport: boolean;
    bank_account_number: string;
    bank_name: string;
    branch_code: string;
  }): Promise<boolean> => {
    try {
      // Add fetchman role if not exists
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'fetchman' as Enums<"app_role">
        })
        .select()
        .single();

      if (roleError && !roleError.message.includes('duplicate key')) {
        console.error("Error adding fetchman role:", roleError);
        return false;
      }

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('fetchman_profiles')
        .select('id')
        .eq('user_id', userId);
      
      if (existingProfile && existingProfile.length > 0) {
        // Profile exists, update it
        const { error: updateError } = await supabase
          .from('fetchman_profiles')
          .update({
            vehicle_type: data.vehicle_type,
            work_hours: data.work_hours,
            service_area: data.service_area,
            phone_number: data.phone_number,
            identity_number: data.identity_number,
            has_own_transport: data.has_own_transport,
            bank_account_number: data.bank_account_number,
            bank_name: data.bank_name,
            branch_code: data.branch_code,
            verification_status: 'pending'
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error("Error updating fetchman profile:", updateError);
          return false;
        }
      } else {
        // Create new profile
        const { error: profileError } = await supabase
          .from('fetchman_profiles')
          .insert({
            user_id: userId,
            vehicle_type: data.vehicle_type,
            work_hours: data.work_hours,
            service_area: data.service_area,
            phone_number: data.phone_number,
            identity_number: data.identity_number,
            has_own_transport: data.has_own_transport,
            bank_account_number: data.bank_account_number,
            bank_name: data.bank_name,
            branch_code: data.branch_code
          });

        if (profileError) {
          console.error("Error creating fetchman profile:", profileError);
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error("Exception creating fetchman profile:", err);
      return false;
    }
  },
  
  /**
   * Get profile data by user ID
   */
  getProfileByUserId: async (userId: string): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Exception fetching profile:", err);
      return null;
    }
  },

  /**
   * Get role-specific profile data
   */
  getRoleProfile: async (userId: string, role: "host" | "merchant" | "fetchman"): Promise<any> => {
    try {
      let tableName: string;
      
      switch(role) {
        case "host":
          tableName = "host_profiles";
          break;
        case "merchant":
          tableName = "vendor_profiles";
          break;
        case "fetchman":
          tableName = "fetchman_profiles";
          break;
        default:
          return null;
      }
      
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error(`Error fetching ${role} profile:`, error);
        return null;
      }

      return data && data.length > 0 ? data[0] : null;
    } catch (err) {
      console.error(`Exception fetching ${role} profile:`, err);
      return null;
    }
  }
};
