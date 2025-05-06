
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle,
  Trash,
  Loader2,
} from "lucide-react";

interface UserProfileData {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  roles: string[];
}

export default function UserDeactivate() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [deleteData, setDeleteData] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Fetch user profile data
  const { data: userProfile, isLoading, error } = useQuery<UserProfileData>({
    queryKey: ["admin-deactivate-user", userId],
    queryFn: async () => {
      // Get basic profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, name, surname")
        .eq("id", userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Get user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
        
      if (rolesError) throw rolesError;
      
      return {
        ...profile,
        roles: userRoles?.map(r => r.role) || []
      };
    },
    enabled: !!userId,
  });

  const handleDeactivateUser = async () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for deactivating this user.",
        variant: "destructive",
      });
      return;
    }

    if (!confirmDeactivate) {
      toast({
        title: "Error",
        description: "You must confirm the deactivation by checking the confirmation box.",
        variant: "destructive",
      });
      return;
    }

    setIsDeactivating(true);

    try {
      // In a real implementation, we would use a secure server endpoint
      // to deactivate the user since this requires admin privileges
      
      console.log(`Deactivating user ${userId} with reason: ${reason}`);
      console.log(`Delete associated data: ${deleteData}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "User deactivated",
        description: "User account has been successfully deactivated.",
      });
      
      // Navigate back to users list after successful deactivation
      navigate("/admin/users");
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast({
        title: "Failed to deactivate user",
        description: "There was an error deactivating this user account.",
        variant: "destructive",
      });
    } finally {
      setIsDeactivating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading user profile: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trash className="h-5 w-5 text-red-500" />
          <CardTitle>Deactivate User Account</CardTitle>
        </div>
        <CardDescription>
          Permanently deactivate the account for {userProfile?.name} {userProfile?.surname}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> This action is irreversible. The user account will be permanently deactivated.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-medium">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{userProfile?.name} {userProfile?.surname}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userProfile?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-medium font-mono text-xs">{userId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roles</p>
                <p className="font-medium">{userProfile?.roles.join(", ") || "No roles assigned"}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Label htmlFor="deactivation-reason" className="text-base font-medium">
              Reason for Deactivation
            </Label>
            <Textarea
              id="deactivation-reason"
              placeholder="Explain why this account is being deactivated..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              This information will be recorded for administrative purposes only.
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-base font-medium">Data Management</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="delete-data" 
                checked={deleteData} 
                onCheckedChange={(checked) => setDeleteData(!!checked)} 
              />
              <Label htmlFor="delete-data" className="font-normal">
                Delete associated user data (content, transactions, etc.)
              </Label>
            </div>
            
            <p className="text-xs text-muted-foreground">
              If unchecked, the user profile will be deactivated but their data will remain in the system.
            </p>
          </div>
          
          <Separator />
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="confirm-deactivate" 
                checked={confirmDeactivate} 
                onCheckedChange={(checked) => setConfirmDeactivate(!!checked)} 
              />
              <Label htmlFor="confirm-deactivate" className="font-semibold text-red-600">
                I understand that this action cannot be undone and the user account will be permanently deactivated
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col xs:flex-row gap-2 w-full">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeactivateUser} 
            disabled={!reason.trim() || !confirmDeactivate || isDeactivating}
            variant="destructive"
            className="w-full"
          >
            {isDeactivating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deactivating...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Deactivate Account
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
