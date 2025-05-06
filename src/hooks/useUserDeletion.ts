
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CheckUserResult, DeleteUserResult } from "@/types/user-management";

export const useUserDeletion = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userDetails, setUserDetails] = useState<CheckUserResult | null>(null);
  const { toast } = useToast();

  // Check if a user exists and get their details
  const checkUserExists = async (userId: string): Promise<CheckUserResult | null> => {
    if (!userId) return null;
    
    try {
      setIsChecking(true);
      console.log(`Checking if user exists: ${userId}`);
      
      const { data, error } = await supabase.rpc('check_user_exists', {
        user_id: userId
      });
      
      if (error) {
        console.error("Error checking user:", error);
        toast({
          title: "Error",
          description: `Could not check user: ${error.message}`,
          variant: "destructive"
        });
        return null;
      }
      
      console.log("User check result:", data);
      const result = data as CheckUserResult;
      setUserDetails(result);
      return result;
    } catch (error: any) {
      console.error("Exception checking user:", error);
      toast({
        title: "Error",
        description: `Unexpected error: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsChecking(false);
    }
  };
  
  // Delete a fetchman user completely from the system
  const deleteFetchmanUser = async (userId: string): Promise<DeleteUserResult | null> => {
    if (!userId) return null;
    
    try {
      setIsDeleting(true);
      console.log(`Starting deletion process for user: ${userId}`);
      
      // First delete from database tables using our SQL function
      const { data: dbDeletionData, error: dbDeletionError } = await supabase.rpc(
        'delete_fetchman_user_completely',
        { fetchman_user_id: userId }
      );
      
      if (dbDeletionError) {
        console.error("Database deletion error:", dbDeletionError);
        return {
          success: false,
          message: `Database deletion failed: ${dbDeletionError.message}`
        };
      }
      
      console.log("Database deletion result:", dbDeletionData);
      const result = dbDeletionData as DeleteUserResult;
      
      if (!result.success) {
        return result;
      }
      
      // If database deletion was successful and auth user exists, delete from auth
      if (userDetails?.auth_user_exists) {
        try {
          console.log("Deleting user from auth system:", userId);
          // Use the admin API to delete the user from auth
          const { error: authDeletionError } = await supabase.auth.admin.deleteUser(userId);
          
          if (authDeletionError) {
            console.error("Auth deletion error:", authDeletionError);
            return {
              success: false,
              message: `Auth user deletion failed: ${authDeletionError.message}`,
              deleted_items: result.deleted_items,
              user_id: userId,
              fetchman_profile_id: result.fetchman_profile_id
            };
          }
        } catch (authError: any) {
          console.error("Auth deletion exception:", authError);
          return {
            success: false,
            message: `Auth deletion exception: ${authError.message}`,
            deleted_items: result.deleted_items,
            user_id: userId
          };
        }
      }
      
      // Finally, refresh the PostgREST schema cache to ensure changes are visible
      try {
        await supabase.rpc('postgrest_schema_cache_refresh');
        console.log("Schema cache refreshed");
      } catch (refreshError) {
        console.error("Schema refresh error:", refreshError);
      }
      
      return {
        success: true,
        message: "User deleted successfully from all systems",
        deleted_items: result.deleted_items,
        user_id: userId,
        fetchman_profile_id: result.fetchman_profile_id
      };
    } catch (error: any) {
      console.error("Exception deleting user:", error);
      return {
        success: false,
        message: `Unexpected error: ${error.message}`
      };
    } finally {
      setIsDeleting(false);
      // Reset user details after deletion
      setUserDetails(null);
    }
  };
  
  return {
    isChecking,
    isDeleting,
    userDetails,
    checkUserExists,
    deleteFetchmanUser
  };
};
