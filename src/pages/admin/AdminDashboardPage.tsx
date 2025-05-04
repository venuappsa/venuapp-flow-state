
import React, { useEffect, useState } from "react";
import AdminDashboard from "@/components/AdminDashboard";
import { useAllFetchmanProfiles } from "@/hooks/useAllFetchmanProfiles";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboardPage() {
  const [relationshipTested, setRelationshipTested] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const { testProfilesRelationship } = useAllFetchmanProfiles();

  // Test the fetchman_profiles to profiles relationship on admin dashboard load
  useEffect(() => {
    const testRelationship = async () => {
      if (relationshipTested) return;
      
      try {
        const result = await testProfilesRelationship();
        
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
    try {
      // Attempt to verify that all fetchman_profiles have corresponding profiles
      const { data: missingProfiles, error: queryError } = await supabase
        .from('fetchman_profiles')
        .select('id, user_id')
        .not('user_id', 'in', (
          supabase.from('profiles').select('id')
        ));
      
      if (queryError) {
        toast({
          title: "Error",
          description: "Failed to check missing profiles: " + queryError.message,
          variant: "destructive",
        });
        return;
      }

      if (missingProfiles && missingProfiles.length > 0) {
        toast({
          title: "Missing Profiles Detected",
          description: `Found ${missingProfiles.length} fetchman profiles without corresponding user profiles.`,
          variant: "destructive",
        });
        return;
      }

      // Re-test the relationship
      const result = await testProfilesRelationship();
      
      if (result.success) {
        setTestError(null);
        toast({
          title: "Success",
          description: "Relationship test now passes!",
        });
      } else {
        toast({
          title: "Fix Attempt Failed",
          description: "Could not automatically fix relationship issues. Manual database correction may be required.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({
        title: "Fix Attempt Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
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
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={attemptToFixRelationship}
              disabled={isFixing}
            >
              {isFixing ? "Attempting Fix..." : "Attempt Auto-Fix"}
            </Button>
            <p className="text-xs text-red-500 mt-1">
              Note: Auto-fix attempts to verify profile relationships but may not resolve all issues.
            </p>
          </div>
        </div>
      )}
      <AdminDashboard />
    </>
  );
}
