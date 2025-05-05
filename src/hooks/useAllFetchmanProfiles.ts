
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

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    testProfilesRelationship
  };
}
