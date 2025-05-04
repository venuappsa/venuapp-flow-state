
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import { UserService } from "@/services/UserService";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export function AdminAccessSelfTest() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Array<{test: string, passed: boolean, message: string}>>([]);
  const [isTesting, setIsTesting] = useState(false);
  const { user } = useUser();
  const { data: roles = [], refetch: refetchRoles } = useUserRoles(user?.id);

  const runTests = async () => {
    if (!user) {
      setResults([{ test: "User Check", passed: false, message: "No user found. Please log in." }]);
      return;
    }

    setIsTesting(true);
    setResults([]);
    const testResults = [];

    // Test 1: Check roles from hook
    testResults.push({
      test: "Roles Check (Hook)",
      passed: roles.includes("admin"),
      message: roles.includes("admin") 
        ? "Admin role found in useUserRoles hook" 
        : `Current roles from hook: ${roles.join(", ") || "none"}`
    });

    // Test 2: Direct database query for roles
    try {
      const directRoles = await UserService.getUserRoles(user.id);
      testResults.push({
        test: "Roles Check (Direct)",
        passed: directRoles.includes("admin"),
        message: directRoles.includes("admin")
          ? "Admin role found in direct database query"
          : `Roles from direct query: ${directRoles.join(", ") || "none"}`
      });
    } catch (error) {
      testResults.push({
        test: "Roles Check (Direct)",
        passed: false,
        message: `Error checking roles directly: ${(error as Error).message}`
      });
    }

    // Test 3: RPC function check
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      
      testResults.push({
        test: "Admin RPC Check",
        passed: !!data,
        message: data
          ? "is_admin() RPC function confirms admin status"
          : "is_admin() RPC function returned false"
      });
    } catch (error) {
      testResults.push({
        test: "Admin RPC Check",
        passed: false,
        message: `Error with RPC check: ${(error as Error).message}`
      });
    }

    // Test 4: Session check
    try {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      
      testResults.push({
        test: "Session Check",
        passed: hasSession,
        message: hasSession
          ? "Active session found"
          : "No active session found"
      });
    } catch (error) {
      testResults.push({
        test: "Session Check",
        passed: false,
        message: `Error checking session: ${(error as Error).message}`
      });
    }

    setResults(testResults);
    setIsTesting(false);
  };

  const refreshTokenAndRetry = async () => {
    try {
      setIsTesting(true);
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session) {
        await refetchRoles();
        runTests();
      } else {
        setResults(prev => [
          ...prev,
          {
            test: "Token Refresh",
            passed: false,
            message: "Failed to refresh token - no session returned"
          }
        ]);
        setIsTesting(false);
      }
    } catch (error) {
      setResults(prev => [
        ...prev,
        {
          test: "Token Refresh",
          passed: false,
          message: `Error refreshing token: ${(error as Error).message}`
        }
      ]);
      setIsTesting(false);
    }
  };

  // Run tests when dialog opens
  useEffect(() => {
    if (open) {
      runTests();
    }
  }, [open]);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} size="sm">
        Test Admin Access
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Admin Access Diagnostics</AlertDialogTitle>
            <AlertDialogDescription>
              Testing your admin access permissions and authentication status...
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 space-y-3 max-h-80 overflow-y-auto">
            {isTesting ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Running tests...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center text-muted-foreground">No test results yet</div>
            ) : (
              results.map((result, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg border p-3 ${
                    result.passed 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <div className="font-medium">
                      {result.test}
                    </div>
                  </div>
                  <p className="mt-1 ml-7 text-sm">
                    {result.message}
                  </p>
                </div>
              ))
            )}
            
            {!isTesting && results.some(r => !r.passed) && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mt-4">
                <p className="text-sm font-medium">Troubleshooting Suggestions:</p>
                <ul className="text-sm mt-1 space-y-1 list-disc pl-5">
                  <li>Try logging out and logging back in</li>
                  <li>Clear your browser cache and cookies</li>
                  <li>Make sure you've been assigned the admin role in the database</li>
                  <li>Check your browser's network console for API errors</li>
                </ul>
              </div>
            )}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button
              variant="outline"
              disabled={isTesting}
              onClick={refreshTokenAndRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Token & Retry
            </Button>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                runTests();
              }}
              disabled={isTesting}
            >
              Run Tests Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
