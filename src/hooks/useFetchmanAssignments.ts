
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";

export function useFetchmanAssignments(fetchmanId?: string, status?: string) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["fetchman-assignments", fetchmanId, status],
    queryFn: async () => {
      if (!fetchmanId) return [];
      
      const { success, data, error } = await UserService.getFetchmanAssignments(fetchmanId, status);
      
      if (!success) {
        console.error("Error fetching fetchman assignments:", error);
        toast({
          title: "Error",
          description: "Failed to load assignments: " + error,
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    },
    enabled: !!fetchmanId
  });
}

export function useAllFetchmanAssignments(filters?: { entityType?: string; entityId?: string; status?: string }) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["all-fetchman-assignments", filters],
    queryFn: async () => {
      const { success, data, error } = await UserService.getAllAssignments(filters);
      
      if (!success) {
        console.error("Error fetching all assignments:", error);
        toast({
          title: "Error",
          description: "Failed to load assignments: " + error,
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    }
  });
}
