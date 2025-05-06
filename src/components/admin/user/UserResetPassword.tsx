
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
      // In production this would use the Supabase admin API to reset the password
      // Since we don't have direct access to that API from the client,
      // we'd normally call a secure server endpoint
      
      // For now, simulate sending a password reset email
      console.log(`Sending password reset email to ${userProfile.email}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful reset
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
      <CardFooter>
        <Button 
          onClick={handleResetPassword} 
          disabled={isResetting || !userProfile?.email}
          className="w-full"
        >
          {isResetting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Reset Email...
            </>
          ) : (
            "Send Password Reset Email"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
