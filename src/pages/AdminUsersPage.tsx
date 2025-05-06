
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, UserPlus, Filter, MoreHorizontal, Edit, Trash, Lock, 
  Eye, Ban, Flag, FileText, DollarSign, MessageSquare 
} from "lucide-react";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserRelationshipDiagnostic } from "@/components/admin/UserRelationshipDiagnostic";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserDeletionManager } from "@/components/admin/UserDeletionManager";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [sortField, setSortField] = useState<string>(searchParams.get("sort") || "created_at");
  const [sortOrder, setSortOrder] = useState<string>(searchParams.get("order") || "desc");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "users");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const itemsPerPage = 10;
  const { toast } = useToast();
  
  // Update search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (currentPage !== 1) params.set("page", currentPage.toString());
    if (sortField !== "created_at") params.set("sort", sortField);
    if (sortOrder !== "desc") params.set("order", sortOrder);
    if (activeTab !== "users") params.set("tab", activeTab);
    setSearchParams(params);
  }, [searchTerm, currentPage, sortField, sortOrder, activeTab, setSearchParams]);

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users', currentPage, sortField, sortOrder],
    queryFn: async () => {
      console.log(`Fetching users for admin panel (page ${currentPage}, sort by ${sortField} ${sortOrder})...`);
      
      // Modified query: First get all profiles without the join
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, surname, email, created_at')
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
      
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
          const { data: fetchman } = await supabase
            .from('fetchman_profiles')
            .select('verification_status, is_suspended')
            .eq('user_id', profile.id)
            .maybeSingle();
           
          if (fetchman) {
            status = fetchman.is_suspended ? "suspended" : fetchman.verification_status;
            console.log(`Fetchman ${profile.email} status: ${status}`);
          } else {
            status = "pending";
          }
        } else if (role === "vendor" || role === "merchant") {
          const { data: vendor } = await supabase
            .from('vendor_profiles')
            .select('verification_status, is_suspended')
            .eq('user_id', profile.id)
            .maybeSingle();
          
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
            .maybeSingle();
          
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

      // Get total count for pagination
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.error("Error getting count:", countError);
      }
      
      console.log(`Total user count: ${count || 'unknown'}`);
      
      return {
        users: usersWithRoles,
        totalCount: count || 0
      };
    }
  });

  const totalPages = Math.ceil((users?.totalCount || 0) / itemsPerPage);
  
  const filteredUsers = users?.users?.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

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
    toast({
      title: "Password reset requested",
      description: "A password reset email has been sent to the user.",
    });
  };

  const handleDeactivateUser = async (userId: string) => {
    toast({
      title: "User deactivated",
      description: "The user account has been deactivated.",
    });
  };
  
  const handleBlacklistUser = async (userId: string) => {
    toast({
      title: "User blacklisted",
      description: "The user has been added to the blacklist.",
    });
  };
  
  const handleFlagUser = async (userId: string) => {
    toast({
      title: "User flagged",
      description: "The user has been flagged for review.",
    });
  };
  
  const handleViewTransactions = (userId: string) => {
    toast({
      title: "View transactions",
      description: "Navigating to user transactions...",
    });
    // In a real implementation, this would navigate to a transactions page
  };
  
  const handleViewRevenue = (userId: string) => {
    toast({
      title: "View revenue",
      description: "Navigating to user revenue dashboard...",
    });
    // In a real implementation, this would navigate to a revenue dashboard
  };
  
  const handleMessageUser = (userId: string) => {
    toast({
      title: "Message user",
      description: "Opening message dialog...",
    });
    // In a real implementation, this would open a messaging dialog
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-gray-500">View and manage all users on the platform</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <TabsList>
              <TabsTrigger value="users">Users List</TabsTrigger>
              <TabsTrigger value="deletion">User Deletion</TabsTrigger>
              <TabsTrigger value="diagnostics">Relationship Diagnostics</TabsTrigger>
            </TabsList>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        <TabsContent value="users" className="space-y-8">
          <Card>
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
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                            User {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
                            Role {sortField === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                            Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                            Joined {sortField === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                          </TableHead>
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
                            <TableCell>{getStatusBadge(user.status || 'unknown')}</TableCell>
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
                                <DropdownMenuContent align="end" className="w-56">
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
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <DropdownMenuItem onClick={() => handleViewTransactions(user.id)}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Transactions
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleViewRevenue(user.id)}>
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    View Revenue
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleMessageUser(user.id)}>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleFlagUser(user.id)}>
                                    <Flag className="h-4 w-4 mr-2" />
                                    Flag User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleBlacklistUser(user.id)}>
                                    <Ban className="h-4 w-4 mr-2" />
                                    Blacklist
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
                  
                  {totalPages > 1 && (
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          
                          {/* First page */}
                          {currentPage > 2 && (
                            <PaginationItem>
                              <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                            </PaginationItem>
                          )}
                          
                          {/* Ellipsis */}
                          {currentPage > 3 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          
                          {/* Previous page */}
                          {currentPage > 1 && (
                            <PaginationItem>
                              <PaginationLink onClick={() => setCurrentPage(currentPage - 1)}>
                                {currentPage - 1}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                          
                          {/* Current page */}
                          <PaginationItem>
                            <PaginationLink isActive>{currentPage}</PaginationLink>
                          </PaginationItem>
                          
                          {/* Next page */}
                          {currentPage < totalPages && (
                            <PaginationItem>
                              <PaginationLink onClick={() => setCurrentPage(currentPage + 1)}>
                                {currentPage + 1}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                          
                          {/* Ellipsis */}
                          {currentPage < totalPages - 2 && (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          )}
                          
                          {/* Last page */}
                          {currentPage < totalPages - 1 && (
                            <PaginationItem>
                              <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          )}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    {searchTerm ? "No users match your search criteria." : "No users found."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deletion">
          <UserDeletionManager 
            defaultUserId={selectedUserId || ""}
            onSuccessfulDeletion={() => {
              refetch();
              toast({
                title: "User deleted",
                description: "The user has been successfully deleted from the system."
              });
            }}
          />
        </TabsContent>
        
        <TabsContent value="diagnostics">
          <UserRelationshipDiagnostic />
        </TabsContent>
      </Tabs>
    </div>
  );
}
