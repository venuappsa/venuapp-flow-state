
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useFetchmanProfile } from '@/hooks/useFetchmanProfile';
import { useAllFetchmanProfiles } from '@/hooks/useAllFetchmanProfiles';
import { supabase } from "@/integrations/supabase/client";
import LogoutSelfTest from './LogoutSelfTest';

export function FetchmanFeaturesSelfTest() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTest, setActiveTest] = useState("profile");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { user } = useUser();
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTestResults([]); // Clear test results when expanding
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Run all test functions
      await testUserAuth();
      await testProfileFetch();
      await testProfilesQuery();
      await testFetchmanPermissions();
    } catch (err) {
      console.error("Error running all tests:", err);
    } finally {
      setIsRunning(false);
    }
  };
  
  const addResult = (name: string, success: boolean, message: string, status: 'success' | 'info' | 'warning' | 'error' = success ? 'success' : 'error') => {
    setTestResults(prev => [...prev, {
      name,
      success,
      message,
      status,
      timestamp: new Date().toISOString()
    }]);
  };

  const testUserAuth = async () => {
    addResult('Starting auth test', true, 'Testing authentication status...', 'info');
    
    try {
      // Check if user is authenticated
      const isAuthenticated = !!user;
      addResult('Authentication check', isAuthenticated, 
        isAuthenticated ? 'User is authenticated' : 'User is not authenticated');
      
      if (!isAuthenticated) return;
      
      // Test session validity
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const hasValidSession = !!sessionData?.session;
      
      addResult('Session validity', hasValidSession, 
        hasValidSession ? 'User has a valid session' : 'Invalid or expired session');
      
      if (sessionError) {
        addResult('Session error', false, `Session error: ${sessionError.message}`);
      }
      
      // Test user roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
        
      const roles = rolesData?.map(r => r.role) || [];
      addResult('User roles', roles.length > 0, 
        roles.length > 0 ? `User has roles: ${roles.join(', ')}` : 'User has no roles');
      
      const hasFetchmanRole = roles.includes('fetchman');
      addResult('Fetchman role', hasFetchmanRole, 
        hasFetchmanRole ? 'User has fetchman role' : 'User does not have fetchman role');
    } catch (error: any) {
      addResult('Auth test error', false, `Error: ${error.message || String(error)}`);
    }
  };

  const testProfileFetch = async () => {
    addResult('Starting profile test', true, 'Testing fetchman profile fetch...', 'info');
    
    try {
      if (!user) {
        addResult('Profile test skipped', false, 'No authenticated user', 'warning');
        return;
      }
      
      // Create a local hook instance for testing
      const fetchmanProfileHook = useFetchmanProfile(user.id);
      
      // Test profile relationship
      const relationshipTest = await fetchmanProfileHook.testProfileRelationship();
      addResult('Profile relationship test', relationshipTest.success, relationshipTest.message);
      
      // Check if profile exists
      const profile = fetchmanProfileHook.profile;
      addResult('Profile existence', !!profile, 
        profile ? 'Fetchman profile found' : 'No fetchman profile found');
      
      if (profile) {
        // Check if user relation works
        addResult('Profile-User relation', !!profile.user, 
          profile.user ? 'User relation working properly' : 'User relation not working');
      }
      
      // Check for any query errors
      if (fetchmanProfileHook.error) {
        addResult('Profile query error', false, 
          `Error in profile query: ${fetchmanProfileHook.error.message}`);
      }
    } catch (error: any) {
      addResult('Profile test error', false, `Error: ${error.message || String(error)}`);
    }
  };

  const testProfilesQuery = async () => {
    addResult('Starting profiles list test', true, 'Testing fetchman profiles list...', 'info');
    
    try {
      // Create a local hook instance for testing
      const fetchmanProfilesHook = useAllFetchmanProfiles();
      
      // Test profiles list relationship
      const relationshipTest = await fetchmanProfilesHook.testProfilesRelationship();
      addResult('Profiles relationship test', relationshipTest.success, relationshipTest.message);
      
      if (relationshipTest.success) {
        addResult('Profiles data check', true, `Successfully fetched ${relationshipTest.data.length} profiles`);
      }
      
      // Check for any query errors
      if (fetchmanProfilesHook.error) {
        addResult('Profiles query error', false, 
          `Error in profiles query: ${fetchmanProfilesHook.error.message}`);
      }
    } catch (error: any) {
      addResult('Profiles test error', false, `Error: ${error.message || String(error)}`);
    }
  };

  const testFetchmanPermissions = async () => {
    addResult('Starting permissions test', true, 'Testing fetchman permissions...', 'info');
    
    try {
      if (!user) {
        addResult('Permissions test skipped', false, 'No authenticated user', 'warning');
        return;
      }
      
      // Test if user can access their own fetchman profile
      const { data: ownProfileData, error: ownProfileError } = await supabase
        .from('fetchman_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      addResult('Own profile access', !ownProfileError, 
        ownProfileError ? `Error accessing own profile: ${ownProfileError.message}` : 'Can access own profile');
      
      // Test if user can access assignments
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('fetchman_assignments')
        .select('*')
        .eq('fetchman_id', ownProfileData?.id)
        .limit(1);
        
      addResult('Assignments access', !assignmentError, 
        assignmentError ? `Error accessing assignments: ${assignmentError.message}` : 'Can access assignments');
      
      // For admin users, test if they can access all profiles
      const { data: userRolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
        
      const isAdmin = userRolesData?.some(r => r.role === 'admin');
      
      if (isAdmin) {
        // Test if admin can access all profiles
        const { data: allProfilesData, error: allProfilesError } = await supabase
          .from('fetchman_profiles')
          .select('*')
          .limit(5);
          
        addResult('Admin profiles access', !allProfilesError, 
          allProfilesError ? `Error accessing all profiles: ${allProfilesError.message}` : 'Admin can access all profiles');
      }
    } catch (error: any) {
      addResult('Permissions test error', false, `Error: ${error.message || String(error)}`);
    }
  };

  if (!isExpanded) {
    return (
      <Button 
        onClick={toggleExpanded}
        className="rounded-full p-3 h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Run Self-Tests"
      >
        <AlertCircle className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="w-96 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Fetchman Self-Tests</CardTitle>
            <CardDescription>Test system functionality</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleExpanded}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTest} onValueChange={setActiveTest}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
            <TabsTrigger value="logout">Logout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test fetchman profiles relationship and data access.
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    setTestResults([]);
                    testProfileFetch();
                    testProfilesQuery();
                  }}
                  disabled={isRunning}
                  className="w-full"
                >
                  {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Test Profile Features
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="auth">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test fetchman authentication and permissions.
              </p>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => {
                    setTestResults([]);
                    testUserAuth();
                    testFetchmanPermissions();
                  }}
                  disabled={isRunning}
                  className="w-full"
                >
                  {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Test Auth Features
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logout">
            <LogoutSelfTest />
          </TabsContent>
        </Tabs>
        
        {testResults.length > 0 && (
          <div className="mt-4 space-y-2 max-h-64 overflow-auto border rounded-md p-2">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                {result.status === 'info' ? (
                  <span className="h-4 w-4 text-blue-500 mt-0.5">•</span>
                ) : result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                )}
                <div>
                  <div className="font-medium">{result.name}</div>
                  <div className="text-muted-foreground text-xs">{result.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="w-full"
          variant="outline"
        >
          {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Run All Tests
        </Button>
      </CardFooter>
    </Card>
  );
}
