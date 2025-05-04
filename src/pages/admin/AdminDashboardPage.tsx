
import React, { useEffect, useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { useAllFetchmanProfiles } from "@/hooks/useAllFetchmanProfiles";
import { toast } from "@/components/ui/use-toast";

export default function AdminDashboardPage() {
  const [relationshipTested, setRelationshipTested] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const { testProfilesRelationship } = useAllFetchmanProfiles();

  // Test the fetchman_profiles to profiles relationship on admin dashboard load
  useEffect(() => {
    const testRelationship = async () => {
      if (relationshipTested) return;
      
      try {
        const result = await testProfilesRelationship();
        
        if (!result.success) {
          console.error("Profile relationship test failed:", result.message);
          setTestError(result.message);
          toast({
            title: "Profile Relationship Test Failed",
            description: result.message,
            variant: "destructive",
          });
        } else {
          console.log("Profile relationship test passed:", result.message);
          setTestError(null);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error testing profile relationship:", error);
        setTestError(errorMessage);
        toast({
          title: "Relationship Test Error",
          description: "Failed to test profile relationships: " + errorMessage,
          variant: "destructive",
        });
      } finally {
        setRelationshipTested(true);
      }
    };

    testRelationship();
  }, [testProfilesRelationship, relationshipTested]);

  return (
    <>
      {testError && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-sm font-medium text-red-800">Schema Relationship Issue Detected</h3>
          <p className="text-sm text-red-600">{testError}</p>
        </div>
      )}
      <AdminDashboard />
    </>
  );
}
