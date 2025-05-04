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
        // Build query with profile relationship
        let query = supabase
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
          `);
        
        // Apply filters if provided
        if (filter?.status) {
          query = query.eq('verification_status', filter.status);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching all fetchman profiles:", error);
          throw new Error(error.message);
        }
        
        // Process each profile to ensure user exists or is null
        const processedData = (data || []).map(profile => {
          // Create a standardized user object from profile relationship
          let userData = null;
          
          // Add null check before accessing profile properties
          if (profile.profile && typeof profile.profile === 'object' && !('error' in profile.profile)) {
            userData = {
              id: profile.profile?.id ?? '',
              email: profile.profile?.email ?? '',
              name: profile.profile?.name ?? null,
              surname: profile.profile?.surname ?? null,
              phone: profile.profile?.phone ?? null
            };
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
        .limit(5); // Just check a few to verify
        
      if (error) {
        return { 
          success: false, 
          message: `Relationship test failed: ${error.message}`,
          error 
        };
      }
      
      if (!data || data.length === 0) {
        return { 
          success: false, 
          message: "No fetchman profiles found" 
        };
      }
      
      // Add null check before accessing item.profile
      const missingProfiles = data.filter(item => {
        return !item.profile || (item.profile && typeof item.profile === 'object' && 'error' in item.profile);
      });
      
      if (missingProfiles.length > 0) {
        return { 
          success: false, 
          message: `${missingProfiles.length} fetchman profiles have missing profile relations` 
        };
      }
      
      return { 
        success: true, 
        message: `Relationship test passed for ${data.length} profiles`, 
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
