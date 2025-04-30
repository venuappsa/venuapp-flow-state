
import React, { useState } from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, User, Edit, Shield, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateDummyUsers } from "@/data/dummyUsers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserRole = "admin" | "host" | "merchant" | "fetchman" | "customer";
type UserStatus = "active" | "inactive" | "pending";

interface DummyUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  avatar?: string;
}

export default function AdminUsersPage() {
  const [users] = useState<DummyUser[]>(generateDummyUsers(20));
  const [filteredUsers, setFilteredUsers] = useState<DummyUser[]>(users);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<DummyUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const usersPerPage = 10;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  
  React.useEffect(() => {
    let result = users;
    
    if (roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter !== "all") {
      result = result.filter(user => user.status === statusFilter);
    }
    
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(lowercaseQuery) || 
        user.email.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    setFilteredUsers(result);
  }, [users, roleFilter, statusFilter, searchQuery]);
  
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
  
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // In a real app, this would update the user role in the database
    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole}`,
    });
  };
  
  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    // In a real app, this would update the user status in the database
    toast({
      title: "Status updated",
      description: `User status has been set to ${newStatus}`,
    });
  };
  
  const handleUserSelect = (user: DummyUser) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin": return "bg-red-500";
      case "host": return "bg-blue-500";
      case "merchant": return "bg-green-500";
      case "fetchman": return "bg-amber-500";
      case "customer": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };
  
  const getStatusBadgeColor = (status: UserStatus) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "inactive": return "bg-gray-500";
      case "pending": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <AdminPanelLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search users by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | "all")}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="host">Host</SelectItem>
                <SelectItem value="merchant">Merchant</SelectItem>
                <SelectItem value="fetchman">Fetchman</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserStatus | "all")}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Avatar>
                            <AvatarFallback className="bg-muted text-primary">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getRoleBadgeColor(user.role)} text-white`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getStatusBadgeColor(user.status)} text-white`}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleUserSelect(user)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              {totalPages > 5 && <PaginationEllipsis />}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        
        {/* User Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            {selectedUser && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">User Details</DialogTitle>
                  <DialogDescription>
                    View and manage user information
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-xl">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                    <p className="text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                
                <Tabs defaultValue="info">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="info">User Info</TabsTrigger>
                    <TabsTrigger value="controls">User Controls</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Role</p>
                        <p>{selectedUser.role}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p>{selectedUser.status}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">User ID</p>
                        <p className="font-mono text-sm">{selectedUser.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Active</p>
                        <p>{selectedUser.lastActive}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="controls" className="space-y-6 mt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Role Assignment</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {["admin", "host", "merchant", "fetchman", "customer"].map((role) => (
                          <Button
                            key={role}
                            variant={selectedUser.role === role ? "default" : "outline"}
                            onClick={() => handleRoleChange(selectedUser.id, role as UserRole)}
                            className="flex items-center gap-2"
                          >
                            <Shield className="h-4 w-4" />
                            {role}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Account Status</h3>
                      <div className="flex gap-2">
                        <Button
                          variant={selectedUser.status === "active" ? "default" : "outline"}
                          onClick={() => handleStatusChange(selectedUser.id, "active")}
                          className="flex items-center gap-2"
                        >
                          <UserCheck className="h-4 w-4" />
                          Activate
                        </Button>
                        <Button
                          variant={selectedUser.status === "inactive" ? "default" : "outline"}
                          onClick={() => handleStatusChange(selectedUser.id, "inactive")}
                          className="flex items-center gap-2"
                        >
                          <UserX className="h-4 w-4" />
                          Deactivate
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminPanelLayout>
  );
}
