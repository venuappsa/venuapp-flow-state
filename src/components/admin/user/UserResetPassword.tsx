
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

interface UserProfileData {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
}

export default function UserResetPassword() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<"idle" | "success" | "error">("idle");

  // Fetch user profile data
  const { data: userProfile, isLoading, error } = useQuery<UserProfileData>({
    queryKey: ["admin-reset-password", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, name, surname")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const handleResetPassword = async () => {
    if (!userProfile?.email) {
      toast({
        title: "Error",
        description: "Unable to process reset, user email not found.",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    setResetStatus("idle");

    try {
      // In production this would use Auth API to reset the password
      // This requires admin privileges so we'd call an edge function or secure API endpoint
      
      // Send password recovery email via Supabase Auth API
      const { error } = await supabase.auth.resetPasswordForEmail(userProfile.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      // Log this action in admin activity logs (if applicable)
      try {
        await supabase
          .from('admin_activity_logs')
          .insert({
            admin_id: 'admin', // In production, this would be the actual admin ID
            action: 'password_reset_initiated',
            details: `Password reset initiated for user: ${userProfile.email}`,
            user_id: userId
          });
      } catch (logError) {
        console.error("Failed to log admin activity:", logError);
        // Non-critical error, don't need to throw
      }
      
      // Update query data
      queryClient.invalidateQueries(["admin-user-activities", userId]);
      
      setResetStatus("success");
      toast({
        title: "Password reset initiated",
        description: `A password reset email has been sent to ${userProfile.email}.`,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      setResetStatus("error");
      toast({
        title: "Reset failed",
        description: "There was an error sending the password reset email.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
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
        <CardTitle>Reset User Password</CardTitle>
        <CardDescription>
          Send a password reset email to the user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="font-medium">User Information</h3>
            <p className="text-sm text-muted-foreground">
              Name: {userProfile?.name} {userProfile?.surname}
            </p>
            <p className="text-sm text-muted-foreground">
              Email: {userProfile?.email}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              This will send a password reset email to the user. They will receive instructions
              on how to create a new password.
            </p>
            <p className="text-sm font-medium">
              Note: This cannot be undone.
            </p>
          </div>

          {resetStatus === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Password reset email sent successfully.
              </AlertDescription>
            </Alert>
          )}

          {resetStatus === "error" && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to send password reset email. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col xs:flex-row gap-2 w-full">
        <Button 
          onClick={() => navigate(`/admin/users/${userId}/profile`)}
          variant="outline"
          className="w-full"
        >
          Back to Profile
        </Button>
        <Button 
          onClick={handleResetPassword} 
          disabled={isResetting || !userProfile?.email || resetStatus === "success"}
          className="w-full"
        >
          {isResetting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Reset Email...
            </>
          ) : resetStatus === "success" ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Email Sent
            </>
          ) : (
            "Send Password Reset Email"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
