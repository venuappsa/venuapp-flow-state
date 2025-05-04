
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
  address?: string;
  mobility_preference?: {
    own_car: boolean;
    public_transport: boolean;
    family_friends: boolean;
  };
  work_areas?: string[];
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  emergency_contact_email?: string;
}

// Define the interface for registration data
interface RegistrationData {
  firstName: string;
  lastName: string;
  phone: string;
  role: "admin" | "host" | "merchant" | "fetchman" | "customer"; // Using a string literal type to match Supabase's expected type
}

// Define the interface for document uploads
interface FetchmanDocumentData {
  fetchmanId: string;
  documentType: string;
  fileUrl: string;
  fileName: string;
}

// Define the interface for assignment data
interface FetchmanAssignmentData {
  fetchmanId: string;
  assignedBy: string;
  entityType: "event" | "vendor" | "host";
  entityId: string;
  startDate: string;
  endDate: string;
  notes?: string;
  briefUrl?: string;
}

// Define the interface for message data
interface FetchmanMessageData {
  fetchmanId: string;
  adminId?: string;
  message: string;
  senderRole: "admin" | "fetchman";
  parentId?: string;
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
          
          // Create user role - using the correct type here for the role field
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({
              // Note: Supabase expects 'user_id', not 'userId'
              user_id: data.user.id,
              role: userData.role as "admin" | "host" | "merchant" | "fetchman" | "customer"
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
            address: profileData.address,
            mobility_preference: profileData.mobility_preference,
            work_areas: profileData.work_areas,
            emergency_contact_name: profileData.emergency_contact_name,
            emergency_contact_relationship: profileData.emergency_contact_relationship,
            emergency_contact_phone: profileData.emergency_contact_phone,
            emergency_contact_email: profileData.emergency_contact_email,
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
            branch_code: profileData.branch_code,
            address: profileData.address,
            mobility_preference: profileData.mobility_preference,
            work_areas: profileData.work_areas,
            emergency_contact_name: profileData.emergency_contact_name,
            emergency_contact_relationship: profileData.emergency_contact_relationship,
            emergency_contact_phone: profileData.emergency_contact_phone,
            emergency_contact_email: profileData.emergency_contact_email
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
                role: 'fetchman' as "fetchman" // Cast as literal type to match expected type
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
  },

  /**
   * Upload a document for a fetchman
   * @param fetchmanId Fetchman profile ID
   * @param documentType Type of document (e.g., 'cv', 'qualification')
   * @param file The file to upload
   * @returns Result object with success status and error/data
   */
  uploadFetchmanDocument: async (fetchmanId: string, documentType: string, file: File): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("UserService: Uploading document for fetchman:", fetchmanId);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fetchmanId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fetchman_documents')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error("UserService: Error uploading file:", uploadError);
        return { success: false, error: uploadError.message };
      }
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('fetchman_documents')
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;
      
      // Create document record
      const { data: documentData, error: documentError } = await supabase
        .from('fetchman_documents')
        .insert({
          fetchman_id: fetchmanId,
          document_type: documentType,
          file_url: fileUrl,
          file_name: file.name
        })
        .select('*')
        .single();
        
      if (documentError) {
        console.error("UserService: Error creating document record:", documentError);
        return { success: false, error: documentError.message };
      }

      // If document is CV, update fetchman_profile.cv_url
      if (documentType === 'cv') {
        const { error: updateError } = await supabase
          .from('fetchman_profiles')
          .update({ cv_url: fileUrl })
          .eq('id', fetchmanId);
          
        if (updateError) {
          console.error("UserService: Error updating CV URL:", updateError);
          // Don't fail the whole operation if this update fails
        }
      }
      
      return { success: true, data: documentData };
      
    } catch (error: any) {
      console.error("UserService: Exception uploading document:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred during document upload." 
      };
    }
  },

  /**
   * Get fetchman profile by user ID
   * @param userId User ID
   * @returns Result object with success status and profile data
   */
  getFetchmanProfileByUserId: async (userId: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("UserService: Getting fetchman profile for user:", userId);
      
      const { data, error } = await supabase
        .from('fetchman_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) {
        console.error("UserService: Error getting fetchman profile:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
      
    } catch (error: any) {
      console.error("UserService: Exception getting fetchman profile:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  },

  /**
   * Get all fetchman profiles with optional filter
   * @param filterOptions Optional filter options
   * @returns Result object with success status and profiles data
   */
  getAllFetchmanProfiles: async (filterOptions?: { status?: string }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("UserService: Getting all fetchman profiles");
      
      let query = supabase
        .from('fetchman_profiles')
        .select('*, profiles(name, surname, email)');

      if (filterOptions?.status) {
        query = query.eq('verification_status', filterOptions.status);
      }
      
      const { data, error } = await query;
        
      if (error) {
        console.error("UserService: Error getting fetchman profiles:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
      
    } catch (error: any) {
      console.error("UserService: Exception getting fetchman profiles:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  },

  /**
   * Create new assignment for a fetchman
   * @param assignmentData Assignment data
   * @returns Result object with success status and assignment data
   */
  createFetchmanAssignment: async (assignmentData: FetchmanAssignmentData): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("UserService: Creating fetchman assignment");
      
      const { data, error } = await supabase
        .from('fetchman_assignments')
        .insert({
          fetchman_id: assignmentData.fetchmanId,
          assigned_by: assignmentData.assignedBy,
          entity_type: assignmentData.entityType,
          entity_id: assignmentData.entityId,
          start_date: assignmentData.startDate,
          end_date: assignmentData.endDate,
          notes: assignmentData.notes,
          brief_url: assignmentData.briefUrl,
          status: new Date(assignmentData.startDate) > new Date() ? 'upcoming' : 'active'
        })
        .select('*')
        .single();
        
      if (error) {
        console.error("UserService: Error creating fetchman assignment:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
      
    } catch (error: any) {
      console.error("UserService: Exception creating fetchman assignment:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  },

  /**
   * Get assignments for a fetchman
   * @param fetchmanId Fetchman ID
   * @param status Optional status filter
   * @returns Result object with success status and assignments data
   */
  getFetchmanAssignments: async (fetchmanId: string, status?: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("UserService: Getting assignments for fetchman:", fetchmanId);
      
      let query = supabase
        .from('fetchman_assignments')
        .select('*')
        .eq('fetchman_id', fetchmanId);
        
      if (status) {
        query = query.eq('status', status);
      }
        
      const { data, error } = await query.order('start_date', { ascending: false });
        
      if (error) {
        console.error("UserService: Error getting fetchman assignments:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
      
    } catch (error: any) {
      console.error("UserService: Exception getting fetchman assignments:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  },

  /**
   * Get all assignments with optional filters
   * @param filterOptions Optional filter options 
   * @returns Result object with success status and assignments data
   */
  getAllAssignments: async (filterOptions?: { entityType?: string; entityId?: string; status?: string }): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("UserService: Getting all fetchman assignments");
      
      let query = supabase
        .from('fetchman_assignments')
        .select('*, fetchman_profiles(id, user_id, phone_number)');
        
      if (filterOptions?.entityType) {
        query = query.eq('entity_type', filterOptions.entityType);
      }
        
      if (filterOptions?.entityId) {
        query = query.eq('entity_id', filterOptions.entityId);
      }
        
      if (filterOptions?.status) {
        query = query.eq('status', filterOptions.status);
      }
        
      const { data, error } = await query.order('created_at', { ascending: false });
        
      if (error) {
        console.error("UserService: Error getting all assignments:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
      
    } catch (error: any) {
      console.error("UserService: Exception getting all assignments:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  },

  /**
   * Send a message between admin and fetchman
   * @param messageData Message data
   * @returns Result object with success status and message data
   */
  sendFetchmanMessage: async (messageData: FetchmanMessageData): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("UserService: Sending fetchman message");
      
      const { data, error } = await supabase
        .from('fetchman_messages')
        .insert({
          fetchman_id: messageData.fetchmanId,
          admin_id: messageData.adminId,
          message: messageData.message,
          sender_role: messageData.senderRole,
          parent_id: messageData.parentId
        })
        .select('*')
        .single();
        
      if (error) {
        console.error("UserService: Error sending fetchman message:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
      
    } catch (error: any) {
      console.error("UserService: Exception sending fetchman message:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  },

  /**
   * Get messages for a fetchman
   * @param fetchmanId Fetchman ID
   * @returns Result object with success status and messages data
   */
  getFetchmanMessages: async (fetchmanId: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      console.log("UserService: Getting messages for fetchman:", fetchmanId);
      
      const { data, error } = await supabase
        .from('fetchman_messages')
        .select('*')
        .eq('fetchman_id', fetchmanId)
        .order('sent_at', { ascending: false });
        
      if (error) {
        console.error("UserService: Error getting fetchman messages:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
      
    } catch (error: any) {
      console.error("UserService: Exception getting fetchman messages:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  },

  /**
   * Mark messages as read
   * @param messageIds Array of message IDs to mark as read
   * @returns Result object with success status
   */
  markMessagesAsRead: async (messageIds: string[]): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("UserService: Marking messages as read");
      
      const { error } = await supabase
        .from('fetchman_messages')
        .update({ read: true })
        .in('id', messageIds);
        
      if (error) {
        console.error("UserService: Error marking messages as read:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
      
    } catch (error: any) {
      console.error("UserService: Exception marking messages as read:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  },

  /**
   * Update fetchman account status (suspend/reinstate/blacklist)
   * @param fetchmanId Fetchman ID
   * @param action Action to perform (suspend, reinstate, blacklist)
   * @param reason Reason for action (optional)
   * @returns Result object with success status
   */
  updateFetchmanStatus: async (fetchmanId: string, action: 'suspend' | 'reinstate' | 'blacklist', reason?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log(`UserService: ${action} fetchman:`, fetchmanId);
      
      if (action === 'suspend') {
        const { error } = await supabase
          .from('fetchman_profiles')
          .update({ is_suspended: true })
          .eq('id', fetchmanId);
          
        if (error) {
          console.error("UserService: Error suspending fetchman:", error);
          return { success: false, error: error.message };
        }
      } 
      else if (action === 'reinstate') {
        const { error } = await supabase
          .from('fetchman_profiles')
          .update({ 
            is_suspended: false,
            is_blacklisted: false
          })
          .eq('id', fetchmanId);
          
        if (error) {
          console.error("UserService: Error reinstating fetchman:", error);
          return { success: false, error: error.message };
        }
      }
      else if (action === 'blacklist' && reason) {
        // First mark as blacklisted in profile
        const { error: updateError } = await supabase
          .from('fetchman_profiles')
          .update({ 
            is_blacklisted: true,
            is_suspended: true
          })
          .eq('id', fetchmanId);
          
        if (updateError) {
          console.error("UserService: Error blacklisting fetchman profile:", updateError);
          return { success: false, error: updateError.message };
        }
        
        // Get admin user ID
        const { data: session } = await supabase.auth.getSession();
        const adminId = session.session?.user.id;
        
        if (!adminId) {
          return { success: false, error: "No admin ID available for blacklist action" };
        }
        
        // Add to blacklist table with reason
        const { error: blacklistError } = await supabase
          .from('fetchman_blacklist')
          .insert({
            fetchman_id: fetchmanId,
            blacklisted_by: adminId,
            reason: reason
          });
          
        if (blacklistError) {
          console.error("UserService: Error adding to blacklist:", blacklistError);
          return { success: false, error: blacklistError.message };
        }
      }
      
      return { success: true };
      
    } catch (error: any) {
      console.error(`UserService: Exception during fetchman ${action}:`, error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  },

  /**
   * Promote fetchman to a new role
   * @param fetchmanId Fetchman ID
   * @param newRole New role to promote to
   * @param notes Optional notes about promotion
   * @returns Result object with success status
   */
  promoteFetchman: async (fetchmanId: string, newRole: string, notes?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log(`UserService: Promoting fetchman ${fetchmanId} to ${newRole}`);
      
      // Get current role
      const { data: fetchmanData, error: fetchError } = await supabase
        .from('fetchman_profiles')
        .select('role')
        .eq('id', fetchmanId)
        .single();
        
      if (fetchError) {
        console.error("UserService: Error getting fetchman role:", fetchError);
        return { success: false, error: fetchError.message };
      }
      
      const previousRole = fetchmanData.role || 'fetchman';
      
      // Update role in profile
      const { error: updateError } = await supabase
        .from('fetchman_profiles')
        .update({ role: newRole })
        .eq('id', fetchmanId);
        
      if (updateError) {
        console.error("UserService: Error updating fetchman role:", updateError);
        return { success: false, error: updateError.message };
      }
      
      // Get admin user ID
      const { data: session } = await supabase.auth.getSession();
      const adminId = session.session?.user.id;
      
      if (!adminId) {
        return { success: false, error: "No admin ID available for promotion action" };
      }
      
      // Add promotion record
      const { error: promotionError } = await supabase
        .from('fetchman_promotions')
        .insert({
          fetchman_id: fetchmanId,
          previous_role: previousRole,
          new_role: newRole,
          promoted_by: adminId,
          notes: notes
        });
        
      if (promotionError) {
        console.error("UserService: Error recording promotion:", promotionError);
        return { success: false, error: promotionError.message };
      }
      
      return { success: true };
      
    } catch (error: any) {
      console.error("UserService: Exception promoting fetchman:", error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred." 
      };
    }
  }
};
