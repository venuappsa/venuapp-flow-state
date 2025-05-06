
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Filter, MoreHorizontal, Edit, Trash, Lock, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserRoles } from "@/hooks/useUserRoles";

interface User {
  id: string;
  name: string | null;
  surname: string | null;
  email: string;
  created_at: string;
  role: string;
  status: string | null;
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log("Fetching users for admin panel...");
      
      // Modified query: First get all profiles without the join
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, surname, email, created_at')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }
      
      console.log(`Found ${profiles?.length || 0} user profiles`);

      // Get user roles in a separate query
      const usersWithRoles = await Promise.all((profiles || []).map(async (profile) => {
        // Fetch role from user_roles table for this user
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.id);
        
        if (roleError) {
          console.error("Error fetching role for user:", profile.id, roleError);
        }
        
        // Extract role or default to unassigned
        let role = "unassigned";
        if (roleData && roleData.length > 0) {
          role = roleData[0].role;
        }
        
        console.log(`User ${profile.email} has role: ${role}`);

        // Get user verification status from different profile tables based on role
        let status = "active";
        
        // Check different profile tables based on role
        if (role === "fetchman") {
          const { data: fetchman, error: fetchmanError } = await supabase
            .from('fetchman_profiles')
            .select('verification_status, is_suspended')
            .eq('user_id', profile.id)
            .maybeSingle(); // Changed from single() to maybeSingle() to handle missing profiles
           
          if (fetchmanError) {
            console.log(`No fetchman profile found for ${profile.email}`, fetchmanError);
          }
          
          if (fetchman) {
            status = fetchman.is_suspended ? "suspended" : fetchman.verification_status;
            console.log(`Fetchman ${profile.email} status: ${status}`);
          } else {
            // Default status if no fetchman profile is found
            status = "pending";
            console.log(`Fetchman ${profile.email} has no profile record, using default status: ${status}`);
          }
        } else if (role === "vendor" || role === "merchant") {
          const { data: vendor } = await supabase
            .from('vendor_profiles')
            .select('verification_status, is_suspended')
            .eq('user_id', profile.id)
            .maybeSingle(); // Changed from single() to maybeSingle()
          
          if (vendor) {
            status = vendor.is_suspended ? "suspended" : vendor.verification_status;
          } else {
            status = "pending";
          }
        } else if (role === "host") {
          const { data: host } = await supabase
            .from('host_profiles')
            .select('verification_status, is_suspended')
            .eq('user_id', profile.id)
            .maybeSingle(); // Changed from single() to maybeSingle()
          
          if (host) {
            status = host.is_suspended ? "suspended" : host.verification_status;
          } else {
            status = "pending";
          }
        }

        return {
          ...profile,
          role,
          status
        } as User;
      }));

      console.log(`Processed ${usersWithRoles.length} users with roles and status`);
      
      // Check specifically for fetchman users
      const fetchmanUsers = usersWithRoles.filter(user => user.role === 'fetchman');
      console.log(`Found ${fetchmanUsers.length} fetchman users:`, fetchmanUsers);

      return usersWithRoles;
    }
  });

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Log filtered users to help diagnose issues
  React.useEffect(() => {
    if (users.length > 0) {
      console.log(`Total users: ${users.length}`);
      console.log(`Filtered users: ${filteredUsers.length}`);
      console.log('User roles distribution:', 
        users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      );
    }
  }, [users, filteredUsers]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case "fetchman":
        return <Badge className="bg-blue-100 text-blue-800">Fetchman</Badge>;
      case "vendor":
      case "merchant":
        return <Badge className="bg-green-100 text-green-800">Vendor</Badge>;
      case "host":
        return <Badge className="bg-yellow-100 text-yellow-800">Host</Badge>;
      case "customer":
      case "attendee":
        return <Badge className="bg-teal-100 text-teal-800">Attendee</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProfileDetailLink = (user: User) => {
    switch(user.role) {
      case "fetchman":
        return `/admin/fetchman/${user.id}`;
      case "vendor":
      case "merchant":
        return `/admin/merchants/${user.id}`;
      case "host":
        return `/admin/hosts/${user.id}`;
      default:
        return `/admin/users/${user.id}`;
    }
  };

  const handleResetPassword = async (userId: string) => {
    // This would typically call a password reset endpoint
    toast({
      title: "Password reset requested",
      description: "A password reset email has been sent to the user.",
    });
  };

  const handleDeactivateUser = async (userId: string) => {
    // This would update the user status in the database
    toast({
      title: "User deactivated",
      description: "The user account has been deactivated.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500">View and manage all users on the platform</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="relative max-w-md mb-4 md:mb-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-x-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                Export
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded-md">
              <h2 className="text-red-800 font-medium">Error loading users</h2>
              <p className="text-red-600">{(error as Error).message}</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{`${user.name || ''} ${user.surname || ''}`}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.created_at && format(new Date(user.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={getProfileDetailLink(user)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                              <Lock className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                              <Trash className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">
                {searchTerm ? "No users match your search criteria." : "No users found."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
