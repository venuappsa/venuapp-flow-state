
import React, { useEffect, useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { useAllFetchmanProfiles } from "@/hooks/useAllFetchmanProfiles";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Import the constants from the client file
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";

export default function AdminDashboardPage() {
  const [relationshipTested, setRelationshipTested] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const [fixingDetails, setFixingDetails] = useState<string | null>(null);
  const { testProfilesRelationship } = useAllFetchmanProfiles();

  // Test the fetchman_profiles to profiles relationship on admin dashboard load
  useEffect(() => {
    const testRelationship = async () => {
      if (relationshipTested) return;
      
      try {
        console.log("Testing fetchman_profiles to profiles relationship on admin dashboard load");
        
        // Delay the test slightly to allow schema cache to refresh
        setTimeout(async () => {
          try {
            const result = await testProfilesRelationship();
            
            console.log("Profile relationship test result:", result);
            
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
  }, [testProfilesRelationship, relationshipTested]);

  // Helper function to fix common relationship issues
  const attemptToFixRelationship = async () => {
    setIsFixing(true);
    setFixingDetails("Starting repair process...");
    try {
      console.log("Attempting to fix profile relationship");
      setFixingDetails("Searching for missing profiles...");
      
      // First, find all fetchman_profiles without corresponding profiles
      const { data: missingProfiles, error: queryError } = await supabase
        .from('fetchman_profiles')
        .select('id, user_id')
        .not('user_id', 'in', (
          supabase.from('profiles').select('id')
        ));
      
      if (queryError) {
        setFixingDetails(`Error checking missing profiles: ${queryError.message}`);
        toast({
          title: "Error",
          description: "Failed to check missing profiles: " + queryError.message,
          variant: "destructive",
        });
        return;
      }

      if (!missingProfiles || missingProfiles.length === 0) {
        setFixingDetails("No missing profiles found. Checking other potential issues...");
      } else {
        setFixingDetails(`Found ${missingProfiles.length} fetchman profiles without corresponding user profiles. Attempting to create them...`);
        
        // Create missing profiles
        for (const missing of missingProfiles) {
          try {
            // Get user data from auth
            const { data: userData, error: userError } = await supabase.auth.getUser(missing.user_id);
            
            if (userError || !userData) {
              console.error(`Failed to get auth user data for ID ${missing.user_id}:`, userError);
              continue;
            }
            
            // Try to create the missing profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: missing.user_id,
                email: userData.user?.email || 'unknown@example.com',
                name: userData.user?.user_metadata?.name || null,
                surname: userData.user?.user_metadata?.surname || null
              });
              
            if (insertError) {
              console.error(`Failed to create profile for user ${missing.user_id}:`, insertError);
            } else {
              console.log(`Created missing profile for user ${missing.user_id}`);
            }
          } catch (userFetchError) {
            console.error(`Error processing user ${missing.user_id}:`, userFetchError);
          }
        }
      }
      
      // Try to use the RPC function for schema cache refresh, if it exists
      setFixingDetails("Attempting to refresh schema cache...");
      try {
        // Using direct fetch to call the function to refresh schema cache
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/rpc/postgrest_schema_cache_refresh`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_PUBLISHABLE_KEY,
              'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
            }
          }
        );
        
        if (!response.ok) {
          console.warn("Schema cache refresh RPC call failed:", await response.text());
          setFixingDetails("Schema cache refresh failed. May need manual intervention.");
        } else {
          setFixingDetails("Schema cache refresh requested. This may take a few moments to propagate.");
          toast({
            title: "Schema Cache Refreshed",
            description: "Database schema cache refresh has been requested."
          });
        }
      } catch (rpcError) {
        console.warn("Error calling schema cache refresh RPC:", rpcError);
        setFixingDetails("Schema cache refresh API error, continuing with repairs...");
      }

      // Wait a moment to let potential cache refresh take effect
      setFixingDetails("Waiting for changes to propagate...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Re-test the relationship
      setFixingDetails("Re-testing relationship after repairs...");
      const result = await testProfilesRelationship();
      
      if (result.success) {
        setTestError(null);
        setFixingDetails("Success! Relationship test now passes.");
        toast({
          title: "Success",
          description: "Relationship test now passes!",
        });
      } else {
        setFixingDetails(`Fix attempt completed but issues remain: ${result.message}`);
        toast({
          title: "Fix Attempt Completed",
          description: "Some issues may still require manual intervention. See details for more information.",
          variant: "destructive", 
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setFixingDetails(`Error during fix attempt: ${errorMessage}`);
      toast({
        title: "Fix Attempt Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  // Refresh the page to reload from cache
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <>
      {testError && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-sm font-medium text-red-800 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Schema Relationship Issue Detected
          </h3>
          <p className="text-sm text-red-600 mt-1">{testError}</p>
          {fixingDetails && isFixing && (
            <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
              <div className="font-medium">Repair status:</div>
              <div className="mt-1">{fixingDetails}</div>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={attemptToFixRelationship}
              disabled={isFixing}
            >
              {isFixing ? "Repairing..." : "Attempt Auto-Repair"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshPage}
            >
              Refresh Page
            </Button>
          </div>
          <p className="text-xs text-red-500 mt-2">
            Note: Auto-repair attempts to fix profile relationships and refresh schema cache, but some issues may require manual database intervention.
          </p>
        </div>
      )}
      <AdminDashboard />
    </>
  );
}
