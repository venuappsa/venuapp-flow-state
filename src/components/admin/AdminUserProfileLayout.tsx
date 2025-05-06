
import React, { ReactNode } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Edit, FileText, DollarSign, MessageSquare, Lock, Flag, Ban, Trash } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface UserProfileData {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  created_at: string;
  roles: string[];
  status: string | null;
  first_login?: string | null;
  last_login?: string | null;
}

interface AdminUserProfileLayoutProps {
  children: ReactNode;
  activeTab: string;
}

const AdminUserProfileLayout = ({ children, activeTab }: AdminUserProfileLayoutProps) => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: userProfile, isLoading, error } = useQuery<UserProfileData>({
    queryKey: ["admin-user-profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      
      // Get basic profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }
      
      if (!profile) {
        throw new Error("User not found");
      }
      
      // Get roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
        
      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        throw rolesError;
      }
      
      // Get user status based on role
      let status = "active"; // Default
      const roles = userRoles.map(r => r.role);
      
      // Check different profile tables based on role
      if (roles.includes("fetchman")) {
        const { data: fetchman } = await supabase
          .from('fetchman_profiles')
          .select('verification_status, is_suspended')
          .eq('user_id', userId)
          .maybeSingle();
         
        if (fetchman) {
          status = fetchman.is_suspended ? "suspended" : fetchman.verification_status;
        } else {
          status = "pending";
        }
      } else if (roles.includes("vendor") || roles.includes("merchant")) {
        const { data: vendor } = await supabase
          .from('vendor_profiles')
          .select('verification_status, is_suspended')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (vendor) {
          status = vendor.is_suspended ? "suspended" : vendor.verification_status;
        } else {
          status = "pending";
        }
      } else if (roles.includes("host")) {
        const { data: host } = await supabase
          .from('host_profiles')
          .select('verification_status, is_suspended')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (host) {
          status = host.is_suspended ? "suspended" : host.verification_status;
        } else {
          status = "pending";
        }
      }
      
      // Get auth data with first and last login
      // Note: This would typically be done through auth.admin APIs or server functions
      // For privacy and security, this would be access-controlled
      // As a placeholder, we're using created_at for first_login
      const authData = {
        first_login: profile.created_at,
        last_login: new Date().toISOString(), // Placeholder
      };
      
      return {
        ...profile,
        roles: roles,
        status,
        first_login: authData.first_login,
        last_login: authData.last_login,
      };
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <Card className="m-8">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-500">Error loading user profile</h2>
          <p className="mb-4">{error instanceof Error ? error.message : "Failed to load user data"}</p>
          <Button onClick={() => navigate("/admin/users")}>Back to Users List</Button>
        </CardContent>
      </Card>
    );
  }

  const getRoleBadges = (roles: string[]) => {
    return roles.map((role) => {
      switch (role) {
        case "admin":
          return <Badge key={role} className="bg-purple-100 text-purple-800">Admin</Badge>;
        case "fetchman":
          return <Badge key={role} className="bg-blue-100 text-blue-800">Fetchman</Badge>;
        case "vendor":
        case "merchant":
          return <Badge key={role} className="bg-green-100 text-green-800">Vendor</Badge>;
        case "host":
          return <Badge key={role} className="bg-yellow-100 text-yellow-800">Host</Badge>;
        case "customer":
        case "attendee":
          return <Badge key={role} className="bg-teal-100 text-teal-800">Attendee</Badge>;
        default:
          return <Badge key={role} variant="outline">{role}</Badge>;
      }
    });
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case "active":
      case "verified":
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
      case "blacklisted":
        return <Badge className="bg-black text-white">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Back button and header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/admin/users")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold">{userProfile.name} {userProfile.surname}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>ID: {userProfile.id}</span>
              {getStatusBadge(userProfile.status)}
              <div className="flex gap-1">
                {getRoleBadges(userProfile.roles)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/users/${userId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Link>
          </Button>
          <Button variant="destructive" size="sm" asChild>
            <Link to={`/admin/users/${userId}/deactivate`}>
              <Trash className="mr-2 h-4 w-4" />
              Deactivate
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Information cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <p className="text-base font-medium">{userProfile.email}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Joined</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <p className="text-base font-medium">
              {userProfile.created_at && format(new Date(userProfile.created_at), 'MMM dd, yyyy')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">First Login</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <p className="text-base font-medium">
              {userProfile.first_login && format(new Date(userProfile.first_login), 'MMM dd, yyyy')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Last Login</CardTitle>
          </CardHeader>
          <CardContent className="py-1">
            <p className="text-base font-medium">
              {userProfile.last_login && format(new Date(userProfile.last_login), 'MMM dd, yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation tabs */}
      <Tabs value={activeTab} className="w-full">
        <TabsList className="mb-6 w-full h-auto flex flex-wrap justify-start">
          <TabsTrigger value="profile" asChild>
            <Link to={`/admin/users/${userId}/profile`} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </TabsTrigger>
          <TabsTrigger value="edit" asChild>
            <Link to={`/admin/users/${userId}/edit`} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </TabsTrigger>
          <TabsTrigger value="transactions" asChild>
            <Link to={`/admin/users/${userId}/transactions`} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="mr-2 h-4 w-4" />
              Transactions
            </Link>
          </TabsTrigger>
          <TabsTrigger value="revenue" asChild>
            <Link to={`/admin/users/${userId}/revenue`} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <DollarSign className="mr-2 h-4 w-4" />
              Revenue
            </Link>
          </TabsTrigger>
          <TabsTrigger value="message" asChild>
            <Link to={`/admin/users/${userId}/message`} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Link>
          </TabsTrigger>
          <TabsTrigger value="reset-password" asChild>
            <Link to={`/admin/users/${userId}/reset-password`} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Lock className="mr-2 h-4 w-4" />
              Reset Password
            </Link>
          </TabsTrigger>
          <TabsTrigger value="flag" asChild>
            <Link to={`/admin/users/${userId}/flag`} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Flag className="mr-2 h-4 w-4" />
              Flag
            </Link>
          </TabsTrigger>
          <TabsTrigger value="blacklist" asChild>
            <Link to={`/admin/users/${userId}/blacklist`} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Ban className="mr-2 h-4 w-4" />
              Blacklist
            </Link>
          </TabsTrigger>
          <TabsTrigger value="deactivate" asChild>
            <Link to={`/admin/users/${userId}/deactivate`} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Trash className="mr-2 h-4 w-4" />
              Deactivate
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Page content */}
      <div className="bg-background rounded-lg border p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminUserProfileLayout;
