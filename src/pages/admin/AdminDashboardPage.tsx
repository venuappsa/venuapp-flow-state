
import React, { useEffect, useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { useAllFetchmanProfiles } from "@/hooks/useAllFetchmanProfiles";
import { toast } from "@/components/ui/use-toast";
import { RelationshipErrorFix } from "@/components/admin/RelationshipErrorFix";
import { useSearchParams } from "react-router-dom";

// Import the constants from the client file
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";

export default function AdminDashboardPage() {
  const [searchParams] = useSearchParams();
  const skipTest = searchParams.get('skipTest') === 'true' || sessionStorage.getItem('bypass_fetchman_test') === 'true';
  
  const [relationshipTested, setRelationshipTested] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const { testProfilesRelationship } = useAllFetchmanProfiles();

  // Test the fetchman_profiles to profiles relationship on admin dashboard load
  useEffect(() => {
    // Skip the test if the URL parameter is present or session storage flag is set
    if (skipTest) {
      console.log("Skipping fetchman_profiles relationship test due to bypass flag");
      setRelationshipTested(true);
      return;
    }
    
    if (relationshipTested) return;
    
    const testRelationship = async () => {
      try {
        console.log("Testing fetchman_profiles to profiles relationship on admin dashboard load");
        
        // Add a random timestamp to query to prevent caching
        const timestamp = new Date().getTime();
        sessionStorage.setItem('last_schema_test', timestamp.toString());
        
        // Delay the test slightly to allow schema cache to refresh
        setTimeout(async () => {
          try {
            const result = await testProfilesRelationship();
            
            console.log(`Profile relationship test result (${timestamp}):`, result);
            
            if (!result.success) {
              console.error("Profile relationship test failed:", result.message, result.error || '');
              setTestError(result.message);
              toast({
                title: "Profile Relationship Test Failed",
                description: result.message,
                variant: "destructive",
              });
            } else {
              console.log("Profile relationship test passed:", result.message);
              setTestError(null);
              toast({
                title: "Profile Relationship Test Passed",
                description: result.message,
              });
            }
          } catch (delayedError) {
            console.error("Error in delayed relationship test:", delayedError);
          }
        }, 1000);
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
  }, [testProfilesRelationship, relationshipTested, skipTest]);

  // Handler when the repair is successful
  const handleRepairSuccess = () => {
    setTestError(null);
  };

  return (
    <>
      <RelationshipErrorFix 
        testError={testError} 
        onSuccess={handleRepairSuccess} 
      />
      
      <AdminDashboard />
    </>
  );
}
