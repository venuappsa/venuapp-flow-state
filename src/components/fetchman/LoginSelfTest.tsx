
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from '@/services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useUserRoles } from '@/hooks/useUserRoles';
import { getRedirectPageForRoles } from '@/hooks/useRoleRedirect';
import { supabase } from '@/integrations/supabase/client';

export default function LoginSelfTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const { user, initialized } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const runSelfTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Check if already logged in
      const isLoggedIn = !!user;
      addResult('Check current login state', true, isLoggedIn ? 'User is already logged in, will log out first' : 'User is not logged in');
      
      // If already logged in, log out first
      if (isLoggedIn) {
        addResult('Logging out current user', true, 'Attempting to sign out user before testing login...');
        await AuthService.signOut();
        addResult('Logout before test', true, 'Successfully logged out current user');
      }
      
      // Test 2: Attempt login with provided credentials
      addResult('Initiating login process', true, 'Attempting to sign in user...');
      
      const result = await AuthService.loginUser(email, password);
      addResult('Login API call', result.success, result.success 
        ? 'Login API call successful' 
        : `Login API call failed: ${result.error || 'Unknown error'}`);
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      // Test 3: Check if session is established
      const sessionValid = await AuthService.isSessionValid();
      addResult('Session validation', sessionValid, sessionValid 
        ? 'Session is valid and established' 
        : 'Session is invalid or not established');
      
      if (!sessionValid) {
        throw new Error('Session not established after login');
      }
      
      // Test 4: Check user roles and determine correct redirect
      addResult('Fetching user roles', true, 'Attempting to retrieve user roles...');
      
      try {
        const { data: userRoles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", result.data?.id);
        
        const roles = userRoles?.map(r => r.role) || [];
        addResult('Role retrieval', true, `User roles retrieved: ${roles.join(', ') || 'none'}`);
        
        // Determine redirect path based on roles
        const redirectPath = getRedirectPageForRoles(roles);
        addResult('Redirect path', true, `Correct redirect path determined: ${redirectPath}`);
        
      } catch (err) {
        console.error('Error fetching roles:', err);
        addResult('Role retrieval', false, `Error fetching roles: ${err instanceof Error ? err.message : String(err)}`);
      }
      
      // Test 5: Check if user data is accessible after login
      if (result.data) {
        addResult('User data access', true, `User data accessible. User ID: ${result.data.id}`);
      } else {
        addResult('User data access', false, 'User data not accessible after login');
      }
      
      // Final success message
      toast({
        title: "Login test completed successfully",
        description: "All login flow tests passed",
      });
    } catch (error) {
      console.error('Login self-test error:', error);
      addResult('Unexpected error', false, `Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
      
      toast({
        title: "Login test failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const addResult = (name: string, success: boolean, message: string, status: 'success' | 'info' | 'error' = success ? 'success' : 'error') => {
    setTestResults(prev => [...prev, {
      name,
      success,
      message,
      status,
      timestamp: new Date().toISOString()
    }]);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Self-Test</CardTitle>
        <CardDescription>
          Test the login functionality to ensure it works correctly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Test Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Test Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
            />
          </div>
        </div>
        
        {testResults.length > 0 && (
          <div className="space-y-2 mt-4">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                {result.success ? 
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" /> : 
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                }
                <div>
                  <div className="font-medium">{result.name}</div>
                  <div className="text-muted-foreground">{result.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runSelfTest} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isRunning ? 'Running Test...' : 'Run Login Test'}
        </Button>
      </CardFooter>
    </Card>
  );
}
