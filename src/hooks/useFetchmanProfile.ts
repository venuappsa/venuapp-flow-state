
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";

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
      
      const { success, data, error } = await UserService.getFetchmanProfileByUserId(targetUserId);
      
      if (!success) {
        console.error("Error fetching fetchman profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data: " + error,
          variant: "destructive",
        });
        return null;
      }
      
      return data;
    },
    enabled: !!targetUserId
  });
  
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
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending
  };
}
