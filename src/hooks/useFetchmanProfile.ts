
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { FetchmanProfile } from "./useAllFetchmanProfiles";

export function useFetchmanProfile(userId?: string) {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // If no userId is provided, use the current user's ID
  const targetUserId = userId || user?.id;
  
  const query = useQuery({
    queryKey: ["fetchman-profile", targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      
      try {
        // Use explicit aliases in the query to avoid column name conflicts
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select(`
            *,
            profile:user_id (
              id,
              email,
              name, 
              surname,
              phone
            )
          `)
          .eq('user_id', targetUserId)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching fetchman profile:", error);
          throw new Error(error.message);
        }
        
        if (!data) {
          return null;
        }

        // Create a standardized profile object with proper null checks
        let profileData = null;
        
        // Improved null checking and type safety
        if (data.profile && 
            typeof data.profile === 'object' && 
            data.profile !== null &&
            !('error' in (data.profile as object))) {
          
          const safeProfile = data.profile as {
            id: string;
            email: string;
            name: string | null;
            surname: string | null;
            phone: string | null;
          } | null;
          
          if (safeProfile) {
            profileData = {
              id: safeProfile.id || '',
              email: safeProfile.email || '',
              name: safeProfile.name,
              surname: safeProfile.surname,
              phone: safeProfile.phone
            };
          }
        }
        
        // Convert work_areas from Json to string[] if needed
        let workAreas: string[] = [];
        if (data.work_areas) {
          if (Array.isArray(data.work_areas)) {
            workAreas = data.work_areas as string[];
          } else if (typeof data.work_areas === 'string') {
            try {
              workAreas = JSON.parse(data.work_areas);
            } catch {
              workAreas = [];
            }
          }
        }
        
        // Transform for consistent interface
        const result: FetchmanProfile = {
          ...data,
          work_areas: workAreas,
          user: profileData,
          profile: profileData
        };
        
        return result;
      } catch (error: any) {
        console.error("Error in fetchman profile query:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data: " + (error.message || String(error)),
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!targetUserId
  });
  
  // Function to test the relationship between profiles and fetchman_profiles
  const testProfileRelationship = async () => {
    if (!targetUserId) return { success: false, message: "No user ID provided" };
    
    try {
      // Use explicit alias to avoid column name conflicts
      const { data, error } = await supabase
        .from('fetchman_profiles')
        .select(`
          id,
          profile:user_id (
            id,
            email,
            name,
            surname
          )
        `)
        .eq('user_id', targetUserId)
        .maybeSingle();
        
      if (error) {
        return { 
          success: false, 
          message: `Relationship test failed: ${error.message}`,
          error 
        };
      }
      
      if (!data) {
        return { 
          success: false, 
          message: "No fetchman profile found for this user" 
        };
      }
      
      // Improved null checking with type safety
      if (!data.profile || (
        data.profile && 
        typeof data.profile === 'object' && 
        'error' in (data.profile as object)
      )) {
        return { 
          success: false, 
          message: "Fetchman profile found, but profile relation is missing" 
        };
      }
      
      return { 
        success: true, 
        message: "Relationship test passed", 
        data 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: `Test error: ${error.message || String(error)}`,
        error 
      };
    }
  };
  
  const updateMutation = useMutation({
    mutationFn: (profileData: any) => {
      if (!targetUserId) throw new Error("No user ID provided");
      return UserService.createFetchmanProfile(targetUserId, profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchman-profile", targetUserId] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  });
  
  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    error: query.error,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    testProfileRelationship // Include the test function
  };
}
