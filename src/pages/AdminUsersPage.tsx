
import React from "react";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
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
              />
            </div>
            <div className="space-x-2">
              <Button variant="outline">
                Filter
              </Button>
              <Button variant="outline">
                Export
              </Button>
            </div>
          </div>

          <div className="text-center py-10">
            <p className="text-gray-500">This is a placeholder for the users table.</p>
            <p className="text-gray-500">The full user management functionality will be implemented soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
