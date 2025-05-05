
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

export function useAllFetchmanProfiles(filter?: { status?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["all-fetchman-profiles", filter],
    queryFn: async () => {
      try {
        console.log("Fetching all fetchman profiles with filter:", filter);
        
        // Try both query approaches
        let queryResult;
        
        try {
          // First attempt: Use the foreign key relationship
          let query = supabase
            .from('fetchman_profiles')
            .select(`
              *,
              profiles(
                id,
                email,
                name,
                surname,
                phone
              )
            `);
          
          // Apply filters if provided
          if (filter?.status) {
            query = query.eq('verification_status', filter.status);
          }
          
          const { data, error } = await query;
          
          if (error) {
            console.error("Error using foreign key relationship:", error);
            throw error;
          }
          
          queryResult = { data, useBackup: false };
          console.log("Foreign key query successful, found profiles:", data?.length || 0);
        } catch (relationshipError) {
          console.warn("Foreign key relationship query failed, using fallback:", relationshipError);
          
          // Fallback: Use a join directly
          let query = supabase
            .from('fetchman_profiles')
            .select(`
              *,
              profiles:profiles(
                id,
                email,
                name,
                surname,
                phone
              )
            `);
          
          // Apply filters if provided
          if (filter?.status) {
            query = query.eq('verification_status', filter.status);
          }
          
          const { data, error } = await query;
          
          if (error) {
            console.error("Error in fallback profile fetch:", error);
            throw error;
          }
          
          queryResult = { data, useBackup: true };
          console.log("Fallback query successful, found profiles:", data?.length || 0);
        }
        
        const { data } = queryResult;
        
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
      
      // Next, find missing profile relationships - FIXED VERSION
      const { data: missingProfiles, error: missingError } = await supabase
        .from('fetchman_profiles')
        .select('id, user_id')
        .filter('user_id', 'not.in', (
          await supabase.from('profiles').select('id')
        ).data?.map(p => p.id) || []);
        
      if (missingError) {
        console.error("Error checking for missing profiles:", missingError);
        return { 
          success: false, 
          message: `Error checking for missing profiles: ${missingError.message}`,
          error: missingError 
        };
      }
      
      if (missingProfiles && missingProfiles.length > 0) {
        console.error(`Found ${missingProfiles.length} fetchman profiles without corresponding user profiles`);
        return { 
          success: false, 
          message: `${missingProfiles.length} fetchman profiles have missing profile relations`,
          missing: missingProfiles 
        };
      }
      
      // If no issues found, test the foreign key or join queries
      try {
        // First attempt: Test using the foreign key relationship
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select(`
            id,
            user_id,
            profiles(
              id,
              email,
              name,
              surname
            )
          `)
          .limit(5); // Just check a few to verify
          
        if (error) {
          console.error("Foreign key test failed:", error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          return { 
            success: false, 
            message: "No fetchman profiles found" 
          };
        }
        
        return { 
          success: true, 
          message: `Relationship test passed for ${data.length} profiles using foreign key`, 
          data 
        };
      }
      catch (relationshipError) {
        console.warn("Foreign key relationship test failed, trying join:", relationshipError);
        
        // Fallback: Test using explicit join
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select(`
            id,
            user_id,
            profiles:profiles(
              id,
              email,
              name,
              surname
            )
          `)
          .limit(5);
          
        if (error) {
          return { 
            success: false, 
            message: `Join relationship test failed: ${error.message}`,
            error 
          };
        }
        
        if (!data || data.length === 0) {
          return { 
            success: false, 
            message: "No fetchman profiles found" 
          };
        }
        
        return { 
          success: true, 
          message: `Relationship test passed for ${data.length} profiles using explicit join`, 
          data 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: `Test error: ${error.message || String(error)}`,
        error 
      };
    }
  };
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ fetchmanId, action, reason }: { fetchmanId: string; action: 'suspend' | 'reinstate' | 'blacklist'; reason?: string }) => {
      return UserService.updateFetchmanStatus(fetchmanId, action, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-fetchman-profiles"] });
      toast({
        title: "Status Updated",
        description: "Fetchman status was successfully updated."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  });
  
  const promoteMutation = useMutation({
    mutationFn: ({ fetchmanId, newRole, notes }: { fetchmanId: string; newRole: string; notes?: string }) => {
      return UserService.promoteFetchman(fetchmanId, newRole, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-fetchman-profiles"] });
      toast({
        title: "Fetchman Promoted",
        description: "Fetchman was successfully promoted to the new role."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Promotion Failed",
        description: error.message || "Failed to promote fetchman",
        variant: "destructive",
      });
    }
  });
  
  const createAssignmentMutation = useMutation({
    mutationFn: (assignmentData: {
      fetchmanId: string;
      entityType: "event" | "vendor" | "host";
      entityId: string;
      startDate: string;
      endDate: string;
      notes?: string;
      briefUrl?: string;
    }) => {
      // Get admin user ID
      return supabase.auth.getSession()
        .then(({ data }) => {
          const adminId = data.session?.user.id;
          
          if (!adminId) {
            throw new Error("No admin ID available for assignment creation");
          }
          
          return UserService.createFetchmanAssignment({
            fetchmanId: assignmentData.fetchmanId,
            assignedBy: adminId,
            entityType: assignmentData.entityType,
            entityId: assignmentData.entityId,
            startDate: assignmentData.startDate,
            endDate: assignmentData.endDate,
            notes: assignmentData.notes,
            briefUrl: assignmentData.briefUrl
          });
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-fetchman-assignments"] });
      toast({
        title: "Assignment Created",
        description: "Assignment was successfully created and notification sent."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to create assignment",
        variant: "destructive",
      });
    }
  });
  
  return {
    fetchmen: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    testProfilesRelationship,
    promote: promoteMutation.mutate,
    isPromoting: promoteMutation.isPending,
    createAssignment: createAssignmentMutation.mutate,
    isCreatingAssignment: createAssignmentMutation.isPending
  };
}
