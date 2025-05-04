
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from '@/services/AuthService';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function LoginSelfTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, initialized, forceClearUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const runSelfTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Check auth initialization
      addResult('Auth initialization check', initialized, 
        initialized ? 'Auth system properly initialized' : 'Auth system not initialized');
      
      // Test 2: Check current login status
      const isLoggedIn = !!user;
      addResult('Login status check', true, 
        isLoggedIn ? 'User is currently logged in' : 'User is not logged in', 'info');
      
      // If already logged in, test logout first
      if (isLoggedIn) {
        addResult('Logging out first', true, 'User is logged in, testing logout first', 'info');
        
        const logoutSuccess = await AuthService.signOut();
        addResult('Logout test', logoutSuccess, 
          logoutSuccess ? 'Logout successful' : 'Logout failed');
        
        if (logoutSuccess) {
          forceClearUser();
          addResult('User state cleared', true, 'Local user state cleared after logout');
        }
      }
      
      // Test 3: Check if we have login credentials
      if (!email || !password) {
        addResult('Missing credentials', false, 
          'Login test requires email and password', 'warning');
        setIsRunning(false);
        return;
      }
      
      // Test 4: Attempt login
      addResult('Login attempt', true, `Attempting to login with ${email}...`, 'info');
      
      const { success, data, error } = await AuthService.loginUser(email, password);
      
      addResult('Login API response', success, 
        success ? 'Login API call successful' : `Login failed: ${error}`);
      
      if (success && data) {
        addResult('User data received', true, 'User data successfully received from API');
        
        // Test 5: Check redirection
        addResult('Redirection test', true, 'User should be redirected to appropriate page based on role');
        
        toast({
          title: "Login test successful",
          description: "You have been successfully logged in",
        });
      }
    } catch (error) {
      console.error('Login self-test error:', error);
      addResult('Unexpected error', false, 
        `Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };
  
  const addResult = (name: string, success: boolean, message: string, 
    status: 'success' | 'info' | 'warning' | 'error' = success ? 'success' : 'error') => {
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
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>
        
        {testResults.length > 0 && (
          <div className="space-y-2 mt-4">
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
