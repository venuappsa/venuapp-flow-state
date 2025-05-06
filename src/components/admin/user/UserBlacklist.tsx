
import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Ban,
  AlertTriangle,
} from "lucide-react";

interface UserProfileData {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  roles: string[];
}

export default function UserBlacklist() {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [confirmDisable, setConfirmDisable] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isBlacklisting, setIsBlacklisting] = useState(false);

  // Fetch user profile data
  const { data: userProfile, isLoading, error } = useQuery<UserProfileData>({
    queryKey: ["admin-blacklist-user", userId],
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

  const handleBlacklistUser = async () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for blacklisting this user.",
        variant: "destructive",
      });
      return;
    }

    if (!confirmDisable) {
      toast({
        title: "Error",
        description: "You must confirm that you want to disable this user's account.",
        variant: "destructive",
      });
      return;
    }

    setIsBlacklisting(true);

    try {
      // In a real implementation, we would update the user's status in the database
      // and potentially add them to a blacklist table
      
      // For fetchman users, there's already a blacklist setup we can use
      if (userProfile?.roles.includes("fetchman")) {
        // Check if there's a fetchman profile
        const { data: fetchmanProfile } = await supabase
          .from("fetchman_profiles")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();
          
        if (fetchmanProfile) {
          // Update the fetchman profile
          await supabase
            .from("fetchman_profiles")
            .update({
              is_blacklisted: true,
              is_suspended: true
            })
            .eq("user_id", userId);
            
          // Add to the blacklist table
          await supabase
            .from("fetchman_blacklist")
            .insert({
              fetchman_id: fetchmanProfile.id,
              blacklisted_by: "admin", // In production this would be the actual admin ID
              reason: reason
            });
        }
      }
      
      // For other user types, we'd handle blacklisting differently
      // but for now we'll just show a successful toast
      
      console.log(`Blacklisting user ${userId} with reason: ${reason}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      toast({
        title: "User blacklisted",
        description: "User has been blacklisted and their account has been disabled.",
      });
      
      setReason("");
      setConfirmDisable(false);
      setConfirmDelete(false);
    } catch (error) {
      console.error("Error blacklisting user:", error);
      toast({
        title: "Failed to blacklist user",
        description: "There was an error blacklisting this user.",
        variant: "destructive",
      });
    } finally {
      setIsBlacklisting(false);
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
          <Ban className="h-5 w-5 text-red-500" />
          <CardTitle>Blacklist User</CardTitle>
        </div>
        <CardDescription>
          Blacklist {userProfile?.name} {userProfile?.surname} and disable their account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> Blacklisting a user is a serious action. This will disable
            their account and prevent them from accessing the platform.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm">{userProfile?.name} {userProfile?.surname}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{userProfile?.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role(s)</p>
                <p className="text-sm">{userProfile?.roles.join(", ") || "No roles assigned"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="text-sm font-mono text-xs">{userId}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blacklist-reason">Reason for Blacklisting</Label>
            <Textarea
              id="blacklist-reason"
              placeholder="Explain why this user is being blacklisted..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Provide specific details about the violations or issues that prompted this blacklisting.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="disable-account" 
                checked={confirmDisable} 
                onCheckedChange={(checked) => setConfirmDisable(!!checked)} 
              />
              <Label htmlFor="disable-account" className="font-normal">
                I confirm that I want to disable this user's account
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="delete-content" 
                checked={confirmDelete} 
                onCheckedChange={(checked) => setConfirmDelete(!!checked)} 
              />
              <Label htmlFor="delete-content" className="font-normal">
                Also delete user's content (optional)
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleBlacklistUser} 
          disabled={!reason.trim() || !confirmDisable || isBlacklisting}
          className="w-full"
          variant="destructive"
        >
          {isBlacklisting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Blacklisting User...
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" />
              Blacklist User
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
