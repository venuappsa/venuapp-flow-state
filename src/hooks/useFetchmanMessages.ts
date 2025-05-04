
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";

export function useFetchmanMessages(fetchmanId?: string) {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["fetchman-messages", fetchmanId],
    queryFn: async () => {
      if (!fetchmanId) return [];
      
      const { success, data, error } = await UserService.getFetchmanMessages(fetchmanId);
      
      if (!success) {
        console.error("Error fetching fetchman messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages: " + error,
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    },
    enabled: !!fetchmanId,
    refetchInterval: 10000 // Refetch every 10 seconds to check for new messages
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: ({ message, parentId }: { message: string; parentId?: string }) => {
      if (!fetchmanId || !user?.id) throw new Error("Missing required IDs");
      
      return UserService.sendFetchmanMessage({
        fetchmanId,
        message,
        senderRole: user.app_metadata?.role === 'admin' ? 'admin' : 'fetchman',
        adminId: user.app_metadata?.role === 'admin' ? user.id : undefined,
        parentId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchman-messages", fetchmanId] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    }
  });
  
  const markAsReadMutation = useMutation({
    mutationFn: (messageIds: string[]) => {
      return UserService.markMessagesAsRead(messageIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchman-messages", fetchmanId] });
    }
  });
  
  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    markAsRead: markAsReadMutation.mutate
  };
}
