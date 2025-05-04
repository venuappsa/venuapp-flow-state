
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAllFetchmanProfiles(filter?: { status?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["all-fetchman-profiles", filter],
    queryFn: async () => {
      const { success, data, error } = await UserService.getAllFetchmanProfiles(filter);
      
      if (!success) {
        console.error("Error fetching all fetchman profiles:", error);
        toast({
          title: "Error",
          description: "Failed to load fetchman profiles: " + error,
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    }
  });
  
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
    refetch: query.refetch,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    promote: promoteMutation.mutate,
    isPromoting: promoteMutation.isPending,
    createAssignment: createAssignmentMutation.mutate,
    isCreatingAssignment: createAssignmentMutation.isPending
  };
}
