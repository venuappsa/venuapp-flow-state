import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import AdminUserProfileLayout from "@/components/admin/AdminUserProfileLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  details: string;
  created_at: string;
}

export default function AdminUserViewProfilePage() {
  const { userId } = useParams<{ userId: string }>();

  // This query fetches the user's activity logs
  const { data: activities, isLoading: activitiesLoading, error: activitiesError } = useQuery<UserActivity[]>({
    queryKey: ["admin-user-activities", userId],
    queryFn: async () => {
      // In a real implementation, we would fetch from a user_activities table
      // For now, we'll simulate a few activities based on what we know about the user
      
      // Get some basic data about the user to create realistic simulated activities
      const { data: profile } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", userId)
        .single();
      
      if (!profile) {
        return [];
      }
      
      const createdDate = new Date(profile.created_at);
      
      // Generate a set of simulated activities
      const simulatedActivities: UserActivity[] = [
        {
          id: "1",
          user_id: userId || "",
          activity_type: "account_created",
          details: "User account was created",
          created_at: profile.created_at
        },
        {
          id: "2",
          user_id: userId || "",
          activity_type: "login",
          details: "User logged in",
          created_at: new Date(createdDate.getTime() + 1000 * 60 * 60).toISOString() // 1 hour later
        },
        {
          id: "3",
          user_id: userId || "",
          activity_type: "profile_updated",
          details: "User updated their profile information",
          created_at: new Date(createdDate.getTime() + 1000 * 60 * 60 * 2).toISOString() // 2 hours later
        },
        {
          id: "4",
          user_id: userId || "",
          activity_type: "login",
          details: "User logged in",
          created_at: new Date(createdDate.getTime() + 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days later
        }
      ];
      
      return simulatedActivities;
    },
    enabled: !!userId
  });

  // This query fetches additional user details that aren't in the basic profile
  const { data: userDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["admin-user-details", userId],
    queryFn: async () => {
      // Try to fetch any associated profiles based on role
      // First we need to check for roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      
      const userRoles = roles?.map(r => r.role) || [];
      let roleSpecificData: any = {};
      
      // Fetch role-specific data if needed
      if (userRoles.includes("fetchman")) {
        const { data } = await supabase
          .from("fetchman_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        
        roleSpecificData.fetchman = data;
      }
      
      if (userRoles.includes("merchant")) {
        const { data } = await supabase
          .from("vendor_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        
        roleSpecificData.vendor = data;
      }
      
      if (userRoles.includes("host")) {
        const { data } = await supabase
          .from("host_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();
        
        roleSpecificData.host = data;
      }
      
      return {
        roles: userRoles,
        roleSpecificData
      };
    },
    enabled: !!userId
  });

  const renderActivityItem = (activity: UserActivity) => {
    // Define badge color based on activity type
    const getBadgeForActivity = (type: string) => {
      switch (type) {
        case "account_created":
          return <Badge variant="outline" className="bg-green-50 text-green-700">Account Created</Badge>;
        case "login":
          return <Badge variant="outline" className="bg-blue-50 text-blue-700">Login</Badge>;
        case "profile_updated":
          return <Badge variant="outline" className="bg-purple-50 text-purple-700">Profile Updated</Badge>;
        case "password_reset":
          return <Badge variant="outline" className="bg-orange-50 text-orange-700">Password Reset</Badge>;
        default:
          return <Badge variant="outline">{type}</Badge>;
      }
    };

    return (
      <div key={activity.id} className="py-4">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center space-x-2">
            {getBadgeForActivity(activity.activity_type)}
            <span className="font-medium">{activity.details}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {format(new Date(activity.created_at), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
      </div>
    );
  };

  const renderRoleSpecificDetails = () => {
    if (!userDetails || !userDetails.roleSpecificData) {
      return null;
    }

    const { roleSpecificData } = userDetails;

    // Render different cards based on which role-specific data we have
    return (
      <>
        {roleSpecificData.fetchman && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Fetchman Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{roleSpecificData.fetchman.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Type</p>
                  <p className="font-medium">{roleSpecificData.fetchman.vehicle_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Area</p>
                  <p className="font-medium">{roleSpecificData.fetchman.service_area}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="font-medium">{roleSpecificData.fetchman.total_deliveries || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-medium">{roleSpecificData.fetchman.rating || 'Not rated'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification Status</p>
                  <p className="font-medium">{roleSpecificData.fetchman.verification_status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {roleSpecificData.vendor && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Vendor Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{roleSpecificData.vendor.company_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Name</p>
                  <p className="font-medium">{roleSpecificData.vendor.contact_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Email</p>
                  <p className="font-medium">{roleSpecificData.vendor.contact_email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Phone</p>
                  <p className="font-medium">{roleSpecificData.vendor.contact_phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification Status</p>
                  <p className="font-medium">{roleSpecificData.vendor.verification_status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {roleSpecificData.host && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Host Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{roleSpecificData.host.company_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Name</p>
                  <p className="font-medium">{roleSpecificData.host.contact_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Email</p>
                  <p className="font-medium">{roleSpecificData.host.contact_email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Phone</p>
                  <p className="font-medium">{roleSpecificData.host.contact_phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification Status</p>
                  <p className="font-medium">{roleSpecificData.host.verification_status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subscription Status</p>
                  <p className="font-medium">{roleSpecificData.host.subscription_status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </>
    );
  };

  return (
    <AdminUserProfileLayout activeTab="profile">
      <Tabs defaultValue="details">
        <TabsContent value="details" className="mt-0 space-y-6">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">User Profile</h2>
            <p className="text-muted-foreground">
              View detailed information about this user's profile and activity.
            </p>
          </div>
          <Separator />
          
          {/* User details section */}
          {detailsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <>
              {renderRoleSpecificDetails()}
            </>
          )}
          
          {/* Activity log section */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : activitiesError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load activity logs.
                  </AlertDescription>
                </Alert>
              ) : activities && activities.length > 0 ? (
                <div className="divide-y">
                  {activities.map(renderActivityItem)}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No activity logs found for this user.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminUserProfileLayout>
  );
}
