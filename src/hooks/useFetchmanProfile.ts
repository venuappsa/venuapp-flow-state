import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { FetchmanProfile } from "@/types/fetchman";

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
        
        // First check if profile exists, if not, try to create it
        await ensureProfileExists(targetUserId);
        
        // Always use explicit join with LEFT JOIN for reliability
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
          console.error("Error fetching fetchman profile:", error);
          throw error;
        }
        
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
        
        // Parse JSON fields as needed
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
        
        let mobilityPreference: Record<string, boolean> = {};
        if (data.mobility_preference) {
          if (typeof data.mobility_preference === 'string') {
            try {
              mobilityPreference = JSON.parse(data.mobility_preference);
            } catch {
              mobilityPreference = {};
            }
          } else if (typeof data.mobility_preference === 'object') {
            mobilityPreference = data.mobility_preference;
          }
        }
        
        // Transform for consistent interface
        const result: FetchmanProfile = {
          ...data,
          work_areas: workAreas,
          mobility_preference: mobilityPreference,
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
  
  // Helper function to ensure a profile exists for the user
  const ensureProfileExists = async (userId: string) => {
    try {
      // Check if profile exists
      const { data: profileCheck, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (profileCheckError) {
        console.warn("Error checking profile existence:", profileCheckError);
        return false;
      } 
      
      if (profileCheck) {
        // Profile exists, no need to create
        return true;
      }
      
      console.warn("Profile does not exist for user ID:", userId);
      
      // Attempt to create missing profile
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser(userId);
        
        if (userError || !userData.user) {
          console.error("Failed to get user data for profile creation:", userError);
          return false;
        }
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userData.user.email || '',
            name: userData.user.user_metadata?.name || null,
            surname: userData.user.user_metadata?.surname || null
          });
          
        if (insertError) {
          console.error("Failed to create missing profile:", insertError);
          return false;
        } else {
          console.log("Successfully created missing profile for:", userId);
          return true;
        }
      } catch (createError) {
        console.error("Error creating missing profile:", createError);
        return false;
      }
    } catch (e) {
      console.error("Error in ensureProfileExists:", e);
      return false;
    }
  };
  
  // Function to test the relationship between profiles and fetchman_profiles
  const testProfileRelationship = async () => {
    if (!targetUserId) return { success: false, message: "No user ID provided" };
    
    try {
      console.log("Testing profile relationship for user ID:", targetUserId);
      
      // First ensure a profile exists
      const profileExists = await ensureProfileExists(targetUserId);
      
      if (!profileExists) {
        return { 
          success: false, 
          message: "Could not ensure profile exists for this user" 
        };
      }
      
      // Always use explicit join for reliability
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
        console.error("Relationship test failed:", error);
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
