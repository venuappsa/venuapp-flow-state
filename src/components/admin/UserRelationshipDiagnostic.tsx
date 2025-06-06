import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader, CheckCircle, AlertCircle } from "lucide-react";
import { useSchemaFix } from "@/hooks/useSchemaFix";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: any;
}

// Define interfaces for our RPC responses
interface ForeignKeyConstraintsResult {
  has_role_constraint: boolean;
  has_fetchman_constraint: boolean;
}

interface TriggerExistsResult {
  exists: boolean;
}

// Define a type for orphaned profile data
interface OrphanedProfile {
  user_id: string;
  role: string;
  profiles: null;
}

// Define a type for auth user data
interface AuthUser {
  id: string;
  email: string | null;
  user_metadata?: {
    name?: string;
    surname?: string;
  };
}

// Define the shape of auth response
interface AuthUsersResponse {
  users?: AuthUser[];
  error?: any;
}

export const UserRelationshipDiagnostic = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [orphanedProfiles, setOrphanedProfiles] = useState<OrphanedProfile[]>([]);
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
      // Check 1: Verify foreign key constraints exist using our RPC function
      const { data: constraintsData, error: constraintsError } = await supabase
        .rpc('check_foreign_key_constraints', {}) as { 
          data: ForeignKeyConstraintsResult | null; 
          error: any;
        };
      
      if (constraintsError) {
        diagnosticResults.push({
          success: false,
          message: `Failed to check constraints: ${constraintsError.message}`
        });
      } else if (constraintsData) {
        // Type assertion to help TypeScript understand the returned data structure
        const hasRoleConstraint = constraintsData.has_role_constraint;
        const hasFetchmanConstraint = constraintsData.has_fetchman_constraint;
        
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
          setOrphanedProfiles(missingProfiles as OrphanedProfile[]);
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
      const { data: triggerData, error: triggerError } = await supabase
        .rpc('check_trigger_exists', {}) as {
          data: TriggerExistsResult | null;
          error: any;
        };
      
      if (triggerError) {
        diagnosticResults.push({
          success: false,
          message: `Failed to check triggers: ${triggerError.message}`
        });
      } else if (triggerData) {
        // Type assertion to help TypeScript understand the returned data structure
        diagnosticResults.push({
          success: triggerData.exists,
          message: triggerData.exists
            ? "Automatic profile creation trigger is active."
            : "Automatic profile creation trigger is missing.",
          details: triggerData
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
      // Cast the response to include the correct type information
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers() as unknown as {
        data: AuthUsersResponse | null;
        error: any;
      };
      
      if (authError) {
        toast({
          title: "Error",
          description: `Could not fetch user data: ${authError.message}`,
          variant: "destructive"
        });
        return;
      }
      
      // Map of user IDs to auth user data
      const userMap = new Map<string, AuthUser>();
      
      if (authUsers?.users && Array.isArray(authUsers.users)) {
        authUsers.users.forEach((user: AuthUser) => {
          userMap.set(user.id, user);
        });
      }
      
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
            email: authUser.email || '',
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
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
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
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={repairMissingProfiles}
                              disabled={isRepairing}
                            >
                              Repair Profiles
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link to="/admin/users">
                                Delete Orphaned Users
                              </Link>
                            </Button>
                          </div>
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
          {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Run Diagnostic
        </Button>
        
        <Button
          variant="outline"
          onClick={() => repairProfiles(true)}
          disabled={isRepairing}
        >
          {isRepairing && <Loader className="mr-2 h-4 w-4 animate-spin" />}
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
