
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReloadIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";
import { useSchemaFix } from "@/hooks/useSchemaFix";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: any;
}

export const UserRelationshipDiagnostic = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [orphanedProfiles, setOrphanedProfiles] = useState<any[]>([]);
  const { toast } = useToast();
  const { 
    repairProfiles, 
    isRepairing, 
    repairDetails, 
    repairSuccess, 
    forceSchemaReset 
  } = useSchemaFix();

  const runDiagnostics = async () => {
    setLoading(true);
    const diagnosticResults: DiagnosticResult[] = [];
    
    try {
      // Check 1: Verify foreign key constraints exist
      const { data: constraints, error: constraintsError } = await supabase
        .from('information_schema.table_constraints')
        .select('constraint_name, table_name')
        .eq('constraint_type', 'FOREIGN KEY')
        .or('table_name.eq.fetchman_profiles,table_name.eq.user_roles');
      
      if (constraintsError) {
        diagnosticResults.push({
          success: false,
          message: `Failed to check constraints: ${constraintsError.message}`
        });
      } else {
        const hasRoleConstraint = constraints?.some(c => 
          c.table_name === 'user_roles' && 
          c.constraint_name.includes('fk_user_roles_profile')
        );
        
        const hasFetchmanConstraint = constraints?.some(c => 
          c.table_name === 'fetchman_profiles' && 
          c.constraint_name.includes('fk_fetchman_profiles_user_id')
        );
        
        diagnosticResults.push({
          success: true,
          message: `Foreign key constraints check: ${hasFetchmanConstraint ? '✓' : '✗'} fetchman_profiles, ${hasRoleConstraint ? '✓' : '✗'} user_roles`
        });
      }
      
      // Check 2: Find users with roles but no profiles
      const { data: missingProfiles, error: missingError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles:profiles(id, email, name, surname)
        `)
        .is('profiles.id', null);
      
      if (missingError) {
        diagnosticResults.push({
          success: false,
          message: `Failed to check for missing profiles: ${missingError.message}`
        });
      } else {
        const count = missingProfiles?.length || 0;
        diagnosticResults.push({
          success: count === 0,
          message: count === 0 
            ? "All users with roles have corresponding profiles." 
            : `Found ${count} users with roles but missing profiles.`,
          details: missingProfiles
        });
        
        // Store orphaned profiles for potential repair
        if (missingProfiles && missingProfiles.length > 0) {
          setOrphanedProfiles(missingProfiles);
        } else {
          setOrphanedProfiles([]);
        }
      }
      
      // Check 3: Find fetchman users with no fetchman_profiles
      const { data: fetchmenWithRoles, error: fetchmenError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'fetchman');
      
      if (fetchmenError) {
        diagnosticResults.push({
          success: false,
          message: `Failed to retrieve fetchman users: ${fetchmenError.message}`
        });
      } else if (fetchmenWithRoles && fetchmenWithRoles.length > 0) {
        const fetchmanIds = fetchmenWithRoles.map(f => f.user_id);
        
        // Check which fetchmen have profiles
        const { data: fetchmanProfiles, error: profilesError } = await supabase
          .from('fetchman_profiles')
          .select('user_id')
          .in('user_id', fetchmanIds);
        
        if (profilesError) {
          diagnosticResults.push({
            success: false,
            message: `Failed to check fetchman profiles: ${profilesError.message}`
          });
        } else {
          const profileIds = new Set(fetchmanProfiles?.map(p => p.user_id) || []);
          const missingFetchmanProfiles = fetchmanIds.filter(id => !profileIds.has(id));
          
          diagnosticResults.push({
            success: missingFetchmanProfiles.length === 0,
            message: missingFetchmanProfiles.length === 0
              ? "All fetchman users have corresponding fetchman profiles."
              : `Found ${missingFetchmanProfiles.length} fetchman users missing fetchman profiles.`,
            details: missingFetchmanProfiles
          });
        }
      } else {
        diagnosticResults.push({
          success: true,
          message: "No fetchman users found in the system."
        });
      }
      
      // Check 4: Verify the ensure_profile_exists trigger exists
      const { data: triggers, error: triggersError } = await supabase
        .from('information_schema.triggers')
        .select('trigger_name, event_manipulation')
        .eq('trigger_name', 'ensure_profile_before_insert');
      
      if (triggersError) {
        diagnosticResults.push({
          success: false,
          message: `Failed to check triggers: ${triggersError.message}`
        });
      } else {
        diagnosticResults.push({
          success: triggers && triggers.length > 0,
          message: triggers && triggers.length > 0
            ? "Automatic profile creation trigger is active."
            : "Automatic profile creation trigger is missing.",
          details: triggers
        });
      }
    } catch (error: any) {
      diagnosticResults.push({
        success: false,
        message: `Unexpected error during diagnostics: ${error.message}`
      });
    } finally {
      setResults(diagnosticResults);
      setLoading(false);
    }
  };
  
  const repairMissingProfiles = async () => {
    if (orphanedProfiles.length === 0) {
      toast({
        title: "Nothing to repair",
        description: "No orphaned profiles were detected."
      });
      return;
    }
    
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        toast({
          title: "Error",
          description: `Could not fetch user data: ${authError.message}`,
          variant: "destructive"
        });
        return;
      }
      
      // Map of user IDs to auth user data
      const userMap = new Map();
      authUsers?.users.forEach(user => {
        userMap.set(user.id, user);
      });
      
      // Create missing profiles
      let successCount = 0;
      let errorCount = 0;
      
      for (const orphan of orphanedProfiles) {
        const authUser = userMap.get(orphan.user_id);
        
        if (!authUser) {
          errorCount++;
          continue;
        }
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: orphan.user_id,
            email: authUser.email,
            name: authUser.user_metadata?.name || 'Unknown',
            surname: authUser.user_metadata?.surname || ''
          });
        
        if (insertError) {
          errorCount++;
        } else {
          successCount++;
        }
      }
      
      toast({
        title: "Repair completed",
        description: `Created ${successCount} profiles. Errors: ${errorCount}`,
        variant: successCount > 0 ? "default" : "destructive"
      });
      
      // Re-run diagnostics
      if (successCount > 0) {
        runDiagnostics();
      }
    } catch (error: any) {
      toast({
        title: "Repair failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Relationship Diagnostic</CardTitle>
        <CardDescription>
          Check and repair user profile relationships to ensure proper data integrity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result, index) => (
                <Alert key={index} variant={result.success ? "default" : "destructive"}>
                  <div className="flex items-center">
                    {result.success ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <AlertTitle className="text-sm font-medium">
                      {result.success ? "Success" : "Issue Detected"}
                    </AlertTitle>
                  </div>
                  <AlertDescription className="mt-1 text-sm">
                    {result.message}
                    {result.details && Array.isArray(result.details) && result.details.length > 0 && (
                      <div className="mt-2">
                        <Badge variant="outline" className="mr-2">
                          {result.details.length} items
                        </Badge>
                        {!result.success && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={repairMissingProfiles}
                            disabled={isRepairing}
                          >
                            Repair Profiles
                          </Button>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Run the diagnostic to check user relationship integrity
            </div>
          )}
          
          {repairDetails && (
            <Alert className="mt-4">
              <AlertTitle>Repair Progress</AlertTitle>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-xs mt-2 p-2 bg-gray-100 rounded">
                  {repairDetails}
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          onClick={runDiagnostics} 
          disabled={loading}
          className="mr-2"
        >
          {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Run Diagnostic
        </Button>
        
        <Button
          variant="outline"
          onClick={() => repairProfiles(true)}
          disabled={isRepairing}
        >
          {isRepairing && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Repair All Profile Links
        </Button>
        
        <Button
          variant="outline"
          onClick={forceSchemaReset}
          disabled={isRepairing}
          className="ml-auto"
        >
          Force Schema Reset
        </Button>
      </CardFooter>
    </Card>
  );
};
