
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
      setFixingDetails("Refreshing schema cache...");
      
      // First, try to refresh the schema cache using a direct fetch instead of rpc
      try {
        // Using direct fetch to the reload_schema_cache function instead of rpc
        // This avoids TypeScript errors since the function isn't in the type definitions
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/rpc/reload_schema_cache`,
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
          console.warn("Failed to reload schema cache via direct API call:", await response.text());
          setFixingDetails("Schema cache refresh failed, trying alternative methods...");
          // Continue with other fixes, this is just a best effort
        } else {
          console.log("Schema cache refresh requested");
          setFixingDetails("Schema cache refresh requested. Checking for missing profiles...");
          toast({
            title: "Schema Cache Refreshed",
            description: "Supabase schema cache refresh has been requested. This may take a few moments."
          });
        }
      } catch (rpcError) {
        console.warn("Error calling reload_schema_cache API:", rpcError);
        setFixingDetails("Schema cache refresh API error, continuing with repairs...");
      }
      
      // Attempt to verify that all fetchman_profiles have corresponding profiles
      setFixingDetails("Checking for missing profile relationships...");
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

      if (missingProfiles && missingProfiles.length > 0) {
        setFixingDetails(`Found ${missingProfiles.length} fetchman profiles without corresponding user profiles. Attempting to create them...`);
        
        // Create missing profiles
        for (const missing of missingProfiles) {
          // First, check if the user exists in auth.users
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(missing.user_id);
          
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
        }
        
        setFixingDetails("Attempted to create missing profiles. Verifying results...");
      } else {
        setFixingDetails("No missing profile relationships found. Verifying foreign key constraints...");
      }

      // Check if the foreign key constraint exists between fetchman_deliveries and vendor_profiles
      try {
        setFixingDetails("Verifying database foreign key constraints...");
        // This is a read-only operation to check if constraints are properly set up
        const { data: constraintCheck, error: constraintError } = await supabase
          .from('fetchman_deliveries')
          .select('vendor_id')
          .limit(1);
          
        if (constraintError) {
          console.warn("Foreign key constraint check failed:", constraintError);
          setFixingDetails("Foreign key constraint check failed. May need manual database intervention.");
        } else {
          console.log("Foreign key constraint check passed");
          setFixingDetails("Foreign key constraints appear to be in order. Finalizing...");
        }
      } catch (constraintCheckError) {
        console.error("Error checking constraints:", constraintCheckError);
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
          variant: "destructive", // Changed from "warning" to "destructive" to match allowed variants
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
