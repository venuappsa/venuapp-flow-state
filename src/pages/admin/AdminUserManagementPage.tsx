
import React from "react";
import { UserDeletionManager } from "@/components/admin/UserDeletionManager";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRelationshipDiagnostic } from "@/components/admin/UserRelationshipDiagnostic";

export default function AdminUserManagementPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">User Management</h1>
      <p className="text-gray-500 mb-6">Manage user accounts, profiles, and system relationships</p>
      
      <Tabs defaultValue="deletion" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="deletion">User Deletion</TabsTrigger>
          <TabsTrigger value="diagnostics">Relationship Diagnostics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deletion">
          <UserDeletionManager 
            defaultUserId={userId}
            onSuccessfulDeletion={() => {
              // We could potentially refresh some data here
              console.log("User successfully deleted");
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
