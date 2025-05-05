
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface FetchmanProfile {
  id: string;
  user_id: string;
  phone_number?: string;
  address?: string;
  vehicle_type?: string;
  service_area?: string;
  work_hours?: string;
  verification_status: string;
  is_suspended?: boolean;
  is_blacklisted?: boolean;
  role?: string;
  has_own_transport: boolean;
  mobility_preference?: any;
  work_areas?: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_email?: string;
  emergency_contact_relationship?: string;
  // Banking fields
  bank_name?: string;
  bank_account_number?: string;
  branch_code?: string;
  // Additional fields
  rating?: number;
  total_deliveries?: number;
  // User profile fields
  user?: {
    id: string;
    email: string;
    name?: string | null;
    surname?: string | null;
    phone?: string | null;
  } | null;
  // Original profile relation field from Supabase
  profile?: {
    id: string;
    email: string;
    name?: string | null;
    surname?: string | null;
    phone?: string | null;
  } | null;
  profiles?: any; // Raw field from the API
}

// Type to handle Supabase query error responses
interface SelectQueryError {
  error: true;
}

// Status update parameters for fetchman profiles
interface StatusUpdateParams {
  fetchmanId: string;
  action: 'suspend' | 'reinstate' | 'blacklist';
  reason?: string;
}

// Promotion parameters for fetchman profiles
interface PromoteParams {
  fetchmanId: string;
  newRole: string;
  notes?: string;
}

// Assignment creation parameters
interface CreateAssignmentParams {
  fetchmanId: string;
  entityType: 'event' | 'vendor' | 'host';
  entityId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export function useAllFetchmanProfiles(filter?: { status?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["all-fetchman-profiles", filter],
    queryFn: async () => {
      try {
        console.log("Fetching all fetchman profiles with filter:", filter);
        
        // Always use explicit join for reliability
        let queryBuilder = supabase
          .from('fetchman_profiles')
          .select(`
            *,
            profiles:profiles!inner(
              id,
              email,
              name,
              surname,
              phone
            )
          `);
        
        // Apply filters if provided
        if (filter?.status) {
          queryBuilder = queryBuilder.eq('verification_status', filter.status);
        }
        
        const { data, error } = await queryBuilder;
        
        if (error) {
          console.error("Error in fetchman profile query:", error);
          throw error;
        }
        
        console.log("Explicit join query successful, found profiles:", data?.length || 0);
        
        // Process each profile to ensure user exists or is null
        const processedData = (data || []).map(profile => {
          // Create a standardized user object from profile relationship
          let userData = null;
          
          // Add proper null checks before accessing profile properties
          if (profile.profiles && 
              typeof profile.profiles === 'object' && 
              profile.profiles !== null) {
            
            // Handle both single object and array results
            const profileObj = Array.isArray(profile.profiles) 
              ? profile.profiles[0] 
              : profile.profiles;
            
            if (profileObj) {
              userData = {
                id: profileObj.id || '',
                email: profileObj.email || '',
                name: profileObj.name,
                surname: profileObj.surname,
                phone: profileObj.phone
              };
            }
          }
          
          // Convert work_areas from Json to string[] if needed
          let workAreas: string[] = [];
          if (profile.work_areas) {
            if (Array.isArray(profile.work_areas)) {
              workAreas = profile.work_areas as string[];
            } else if (typeof profile.work_areas === 'string') {
              try {
                // Try to parse if it's a JSON string
                workAreas = JSON.parse(profile.work_areas);
              } catch {
                workAreas = [];
              }
            }
          }
          
          // Return object with consistent structure
          return { 
            ...profile, 
            work_areas: workAreas,
            user: userData,
            profile: userData // Keep both for backward compatibility
          } as FetchmanProfile;
        });
        
        return processedData;
      } catch (error: any) {
        console.error("Error in all fetchman profiles query:", error);
        toast({
          title: "Error",
          description: "Failed to load fetchman profiles: " + (error.message || String(error)),
          variant: "destructive",
        });
        throw error;
      }
    }
  });
  
  // Function to test the relationship across all fetchman profiles
  const testProfilesRelationship = async () => {
    try {
      console.log("Testing fetchman_profiles to profiles relationship");
      
      // First, check if we can access the profiles table
      const { data: profilesCheck, error: profilesError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });
        
      if (profilesError) {
        console.error("Error accessing profiles table:", profilesError);
        return { 
          success: false, 
          message: `Cannot access profiles table: ${profilesError.message}`,
          error: profilesError 
        };
      }
      
      // Then check if we can access fetchman_profiles
      const { data: fetchmanCheck, error: fetchmanError } = await supabase
        .from('fetchman_profiles')
        .select('count', { count: 'exact', head: true });
        
      if (fetchmanError) {
        console.error("Error accessing fetchman_profiles table:", fetchmanError);
        return { 
          success: false, 
          message: `Cannot access fetchman_profiles table: ${fetchmanError.message}`,
          error: fetchmanError 
        };
      }
      
      // Test the join directly with an explicit inner join
      const { data: joinTestData, error: joinTestError } = await supabase
        .from('fetchman_profiles')
        .select(`
          id,
          user_id,
          profiles:profiles!inner(id)
        `)
        .limit(1);
      
      if (joinTestError) {
        console.error("Error testing join relationship:", joinTestError);
        return { 
          success: false, 
          message: `Error testing join relationship: ${joinTestError.message}`, 
          error: joinTestError 
        };
      }
      
      // Check for orphaned records
      const { data: orphanedData, error: orphanedError } = await supabase
        .from('fetchman_profiles')
        .select('id, user_id')
        .not('user_id', 'in', '(SELECT id FROM profiles)')
        .limit(5);
      
      if (orphanedError) {
        console.warn("Error checking for orphaned records:", orphanedError);
      }
      
      if (orphanedData && orphanedData.length > 0) {
        return {
          success: false,
          message: `Found ${orphanedData.length} fetchman profiles without corresponding user profiles. Run the repair tool to fix.`,
          orphanedData
        };
      }
      
      return {
        success: true,
        message: "The relationship between fetchman_profiles and profiles is working correctly."
      };
    } catch (error: any) {
      console.error("Error testing relationship:", error);
      return { 
        success: false, 
        message: `Unexpected error testing relationship: ${error.message || String(error)}`, 
        error 
      };
    }
  };

  // Add status update mutation
  const statusUpdateMutation = useMutation({
    mutationFn: async (params: StatusUpdateParams) => {
      console.log("Updating fetchman status:", params);
      
      // For blacklisting, we need to handle it specially
      if (params.action === 'blacklist') {
        if (!params.reason) throw new Error("Reason is required for blacklisting");
        
        // First update the profile
        const { data: updateData, error: updateError } = await supabase
          .from('fetchman_profiles')
          .update({ is_blacklisted: true })
          .eq('id', params.fetchmanId)
          .select();
          
        if (updateError) throw updateError;
        
        // Then create a blacklist entry
        const { error: blacklistError } = await supabase
          .from('fetchman_blacklist')
          .insert({
            fetchman_id: params.fetchmanId,
            blacklisted_by: (await supabase.auth.getUser()).data.user?.id,
            reason: params.reason
          });
          
        if (blacklistError) throw blacklistError;
        return updateData;
      } else {
        // For suspend/reinstate, just update the is_suspended field
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .update({ 
            is_suspended: params.action === 'suspend' 
          })
          .eq('id', params.fetchmanId)
          .select();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-fetchman-profiles"] });
      toast({
        title: "Status Updated",
        description: "Fetchman status has been updated."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update status: " + (error.message || String(error)),
        variant: "destructive",
      });
    }
  });

  // Add promotion mutation
  const promoteMutation = useMutation({
    mutationFn: async (params: PromoteParams) => {
      console.log("Promoting fetchman:", params);
      
      // Start a transaction to update both the profile and create a promotion record
      const { data: fetchman, error: fetchErr } = await supabase
        .from('fetchman_profiles')
        .select('role')
        .eq('id', params.fetchmanId)
        .single();
        
      if (fetchErr) throw fetchErr;
      
      const previousRole = fetchman.role || 'fetchman';
      
      // Update the role
      const { data: updateData, error: updateErr } = await supabase
        .from('fetchman_profiles')
        .update({ role: params.newRole })
        .eq('id', params.fetchmanId)
        .select();
        
      if (updateErr) throw updateErr;
      
      // Create a promotion record
      const { error: promotionErr } = await supabase
        .from('fetchman_promotions')
        .insert({
          fetchman_id: params.fetchmanId,
          promoted_by: (await supabase.auth.getUser()).data.user?.id,
          previous_role: previousRole,
          new_role: params.newRole,
          notes: params.notes || null
        });
        
      if (promotionErr) throw promotionErr;
      
      return updateData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-fetchman-profiles"] });
      toast({
        title: "Promotion Complete",
        description: "Fetchman has been promoted successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Promotion Failed",
        description: "Failed to promote fetchman: " + (error.message || String(error)),
        variant: "destructive",
      });
    }
  });

  // Add assignment creation mutation
  const createAssignmentMutation = useMutation({
    mutationFn: async (params: CreateAssignmentParams) => {
      console.log("Creating assignment:", params);
      
      const { data, error } = await supabase
        .from('fetchman_assignments')
        .insert({
          fetchman_id: params.fetchmanId,
          entity_type: params.entityType,
          entity_id: params.entityId,
          start_date: params.startDate,
          end_date: params.endDate,
          notes: params.notes || null,
          assigned_by: (await supabase.auth.getUser()).data.user?.id,
          status: 'upcoming'
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Assignment Created",
        description: "New assignment has been created successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Assignment Failed",
        description: "Failed to create assignment: " + (error.message || String(error)),
        variant: "destructive",
      });
    }
  });

  return {
    data: query.data || [],
    fetchmen: query.data || [], // Alias for AdminFetchmanPage
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    testProfilesRelationship,
    // Status update functions
    updateStatus: statusUpdateMutation.mutate,
    isUpdatingStatus: statusUpdateMutation.isPending,
    // Promotion functions
    promote: promoteMutation.mutate,
    isPromoting: promoteMutation.isPending,
    // Assignment functions
    createAssignment: createAssignmentMutation.mutate,
    isCreatingAssignment: createAssignmentMutation.isPending
  };
}
