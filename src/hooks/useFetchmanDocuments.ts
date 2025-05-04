
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserService } from "@/services/UserService";
import { useToast } from "@/components/ui/use-toast";

export function useFetchmanDocuments(fetchmanId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["fetchman-documents", fetchmanId],
    queryFn: async () => {
      if (!fetchmanId) return [];
      
      const { data, error } = await supabase
        .from("fetchman_documents")
        .select("*")
        .eq("fetchman_id", fetchmanId)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching fetchman documents:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!fetchmanId
  });
  
  const uploadMutation = useMutation({
    mutationFn: ({ documentType, file }: { documentType: string, file: File }) => {
      if (!fetchmanId) throw new Error("No fetchman ID provided");
      return UserService.uploadFetchmanDocument(fetchmanId, documentType, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchman-documents", fetchmanId] });
      queryClient.invalidateQueries({ queryKey: ["fetchman-profile", fetchmanId] });
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    }
  });
  
  return {
    documents: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    uploadDocument: uploadMutation.mutate,
    isUploading: uploadMutation.isPending
  };
}
