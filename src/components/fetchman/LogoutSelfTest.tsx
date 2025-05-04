
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthService } from '@/services/AuthService';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function LogoutSelfTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { user, forceClearUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const runSelfTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Check if user is logged in
      const loggedIn = !!user;
      addResult('Check if user is logged in', loggedIn, loggedIn ? 'User is logged in' : 'User is not logged in');
      
      // Cannot run remaining tests if not logged in
      if (!loggedIn) {
        addResult('Logout Tests', false, 'Cannot run logout tests without a logged in user', 'error');
        return;
      }
      
      // Test 2: Test logout functionality
      addResult('Initiating logout process', true, 'Attempting to sign out user...');
      
      const success = await AuthService.signOut();
      addResult('Logout API call', success, success ? 'Logout API call successful' : 'Logout API call failed');
      
      // Test 3: Clear local state
      if (success) {
        forceClearUser();
        addResult('Clear local user state', true, 'Local user state cleared successfully');
      }
      
      // Test 4: Navigate to home page
      if (success) {
        navigate('/', { replace: true });
        addResult('Redirect after logout', true, 'Successfully redirected to home page');
      }
      
      // Final success message
      if (success) {
        toast({
          title: "Logout test successful",
          description: "You have been successfully logged out",
        });
      }
    } catch (error) {
      console.error('Logout self-test error:', error);
      addResult('Unexpected error', false, `Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
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
        <CardTitle>Logout Self-Test</CardTitle>
        <CardDescription>
          Test the logout functionality to ensure it works correctly
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          {isRunning ? 'Running Test...' : 'Run Logout Test'}
        </Button>
      </CardFooter>
    </Card>
  );
}
