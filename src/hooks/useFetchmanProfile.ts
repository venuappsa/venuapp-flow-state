
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
        console.log("Fetching fetchman profile for user ID:", targetUserId);
        
        // Check if we can use the foreign key relationship
        let queryResult;
        
        try {
          // First attempt: Use the foreign key relationship
          const { data, error } = await supabase
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
            `)
            .eq('user_id', targetUserId)
            .maybeSingle();
          
          if (error) {
            console.error("Error using foreign key relationship:", error);
            throw error;
          }
          
          queryResult = { data, useBackup: false };
          console.log("Foreign key query result:", data);
        } catch (relationshipError) {
          console.warn("Foreign key relationship query failed, using fallback:", relationshipError);
          
          // Fallback: Use a join directly
          const { data, error } = await supabase
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
            `)
            .eq('user_id', targetUserId)
            .maybeSingle();
          
          if (error) {
            console.error("Error in fallback profile fetch:", error);
            throw error;
          }
          
          queryResult = { data, useBackup: true };
          console.log("Fallback query result:", data);
        }
        
        const { data } = queryResult;
        
        if (!data) {
          console.log("No fetchman profile found for user:", targetUserId);
          return null;
        }

        // Create a standardized profile object with proper null checks
        let profileData = null;
        
        // Improved null checking and type safety
        if (data.profiles && 
            typeof data.profiles === 'object' && 
            data.profiles !== null) {
          
          // Handle single object (direct relation) vs array (join result)
          const profileObj = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
          
          if (profileObj) {
            profileData = {
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
      console.log("Testing profile relationship for user ID:", targetUserId);
      
      // Try both relationship styles to see which one works
      try {
        // Use the foreign key relationship
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select(`
            id,
            profiles(
              id,
              email,
              name,
              surname
            )
          `)
          .eq('user_id', targetUserId)
          .maybeSingle();
          
        if (error) {
          console.error("Foreign key test failed:", error);
          throw error;
        }
        
        if (!data) {
          return { 
            success: false, 
            message: "No fetchman profile found for this user" 
          };
        }
        
        // Check if profile relation exists
        if (!data.profiles || (
          data.profiles && 
          typeof data.profiles === 'object' && 
          Object.keys(data.profiles).length === 0
        )) {
          return { 
            success: false, 
            message: "Fetchman profile found, but profile relation is missing" 
          };
        }
        
        return { 
          success: true, 
          message: "Relationship test passed using foreign key", 
          data 
        };
      }
      catch (relationshipError) {
        console.warn("Foreign key relationship test failed, trying join:", relationshipError);
        
        // Try with explicit join
        const { data, error } = await supabase
          .from('fetchman_profiles')
          .select(`
            id,
            profiles:profiles!inner(
              id,
              email,
              name,
              surname
            )
          `)
          .eq('user_id', targetUserId)
          .maybeSingle();
          
        if (error) {
          console.error("Join relationship test failed:", error);
          return { 
            success: false, 
            message: `Join relationship test failed: ${error.message}`,
            error 
          };
        }
        
        if (!data) {
          return { 
            success: false, 
            message: "No fetchman profile found for this user" 
          };
        }
        
        // Check if profile relation exists
        if (!data.profiles || (
          data.profiles && 
          typeof data.profiles === 'object' && 
          Array.isArray(data.profiles) && 
          data.profiles.length === 0
        )) {
          return { 
            success: false, 
            message: "Fetchman profile found, but profile relation is missing" 
          };
        }
        
        return { 
          success: true, 
          message: "Relationship test passed using explicit join", 
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
