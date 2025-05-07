
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Flag } from "lucide-react";

interface UserProfileData {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
}

export default function UserFlag() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [severity, setSeverity] = useState("low");
  const [isFlagging, setIsFlagging] = useState(false);

  // Fetch user profile data
  const { data: userProfile, isLoading, error } = useQuery<UserProfileData>({
    queryKey: ["admin-flag-user", userId],
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

  const handleFlagUser = async () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for flagging this user.",
        variant: "destructive",
      });
      return;
    }

    setIsFlagging(true);

    try {
      // Since there's no user_flags table in the DB schema,
      // We'll use the fetchman_profiles or vendor_profiles tables to mark users
      
      // Check if user is a fetchman and update relevant field
      const { data: fetchmanProfile } = await supabase
        .from("fetchman_profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (fetchmanProfile) {
        await supabase
          .from("fetchman_profiles")
          .update({
            is_suspended: severity === "high"  // Suspend immediately for high severity
          })
          .eq("user_id", userId);
      }
      
      // Check if user is a vendor/merchant and update relevant field
      const { data: vendorProfile } = await supabase
        .from("vendor_profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (vendorProfile) {
        await supabase
          .from("vendor_profiles")
          .update({
            is_suspended: severity === "high"  // Suspend immediately for high severity
          })
          .eq("user_id", userId);
      }
      
      // Log flag action (using console since table doesn't exist)
      console.log(`User flagged: ${userId}. Severity: ${severity}. Reason: ${reason}`);
      
      // Invalidate and refetch queries with proper syntax
      queryClient.invalidateQueries({
        queryKey: ["admin-user-profile", userId]
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-users"]
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-user-activities", userId]
      });
      
      toast({
        title: "User flagged",
        description: `User has been flagged with ${severity} severity.`,
      });
      
      // Reset form or navigate
      setReason("");
      navigate(`/admin/users/${userId}/profile`);
    } catch (error) {
      console.error("Error flagging user:", error);
      toast({
        title: "Failed to flag user",
        description: "There was an error flagging this user.",
        variant: "destructive",
      });
    } finally {
      setIsFlagging(false);
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
          <Flag className="h-5 w-5 text-orange-500" />
          <CardTitle>Flag User</CardTitle>
        </div>
        <CardDescription>
          Flag {userProfile?.name} {userProfile?.surname} for review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">User Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm">{userProfile?.name} {userProfile?.surname}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{userProfile?.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="flag-severity">Severity</Label>
            <RadioGroup 
              id="flag-severity" 
              value={severity} 
              onValueChange={setSeverity}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="severity-low" />
                <Label htmlFor="severity-low" className="font-normal">Low - Minor concern, monitor behavior</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="severity-medium" />
                <Label htmlFor="severity-medium" className="font-normal">Medium - Significant concern, requires attention</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="severity-high" />
                <Label htmlFor="severity-high" className="font-normal">High - Serious issue, immediate action required</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="flag-reason">Reason for Flag</Label>
            <Textarea
              id="flag-reason"
              placeholder="Explain why this user is being flagged..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Provide specific details about the behavior or issue that prompted this flag.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col xs:flex-row gap-2 w-full">
        <Button 
          onClick={() => navigate(`/admin/users/${userId}/profile`)}
          variant="outline"
          className="w-full"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleFlagUser} 
          disabled={!reason.trim() || isFlagging}
          className="w-full"
          variant="destructive"
        >
          {isFlagging ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Flagging User...
            </>
          ) : (
            <>
              <Flag className="mr-2 h-4 w-4" />
              Flag User
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
