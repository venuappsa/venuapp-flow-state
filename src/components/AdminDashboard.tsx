
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRelationshipDiagnostic } from "@/components/admin/UserRelationshipDiagnostic";
import { ShieldAlert, Users, UserX } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-500">Manage system users, settings, and diagnostics</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage all user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              View, delete, or modify user accounts across the system
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fetchman Management</CardTitle>
            <CardDescription>Manage fetchman accounts and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              View and manage fetchman profiles, assignments, and verification status
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/admin/fetchmen">
                <Users className="mr-2 h-4 w-4" />
                Manage Fetchmen
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Diagnostics</CardTitle>
            <CardDescription>Check system health and integrity</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Run diagnostics on database relationships and system integrity
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link to="/admin/users?tab=diagnostics">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Run Diagnostics
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/users">
              <UserX className="mr-2 h-4 w-4" />
              Delete User
            </Link>
          </Button>
          {/* More quick actions can be added here */}
        </div>
      </div>
      
      <UserRelationshipDiagnostic />
    </div>
  );
}
