
import React, { useEffect, useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { useAllFetchmanProfiles } from "@/hooks/useAllFetchmanProfiles";
import { toast } from "@/components/ui/use-toast";

export default function AdminDashboardPage() {
  const [relationshipTested, setRelationshipTested] = useState(false);
  const { testProfilesRelationship } = useAllFetchmanProfiles();

  // Test the fetchman_profiles to profiles relationship on admin dashboard load
  useEffect(() => {
    const testRelationship = async () => {
      if (relationshipTested) return;
      
      try {
        const result = await testProfilesRelationship();
        
        if (!result.success) {
          console.error("Profile relationship test failed:", result.message);
          toast({
            title: "Profile Relationship Test Failed",
            description: result.message,
            variant: "destructive",
          });
        } else {
          console.log("Profile relationship test passed:", result.message);
        }
      } catch (error) {
        console.error("Error testing profile relationship:", error);
      } finally {
        setRelationshipTested(true);
      }
    };

    testRelationship();
  }, [testProfilesRelationship, relationshipTested]);

  return <AdminDashboard />;
}
