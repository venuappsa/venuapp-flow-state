import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { user, initialized } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the redirect path from location state, query params or default to "/"
  const queryParams = new URLSearchParams(location.search);
  const nextParam = queryParams.get('next');
  const from = nextParam || location.state?.from?.pathname || "/";

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (initialized && user) {
      console.log("AuthPage: User already authenticated, redirecting...");
      
      // Fetch user roles and redirect based on role
      const fetchUserRolesAndRedirect = async () => {
        try {
          const { data: userRoles, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id);
          
          if (error) {
            console.error("Error fetching user roles:", error);
            toast({
              title: "Could not retrieve user roles",
              description: "Please try again or contact support",
              variant: "destructive"
            });
            return;
          }
          
          const roles = userRoles?.map(r => r.role) || [];
          console.log("AuthPage: Already logged in, user roles:", roles);
          
          // Navigate to appropriate dashboard based on role or to the 'next' URL if specified
          if (nextParam) {
            // Verify the nextParam is a valid route to prevent 404s
            const isValidRoute = verifyRouteExists(nextParam);
            
            if (isValidRoute) {
              console.log("AuthPage: Redirecting to requested page:", nextParam);
              navigate(nextParam);
            } else {
              console.log("AuthPage: Requested page may not exist:", nextParam);
              // Use role-based redirect instead of potentially invalid next param
              const redirectPath = getRedirectPageForRoles(roles);
              console.log("AuthPage: Using role-based redirect instead:", redirectPath);
              navigate(redirectPath);
            }
          } else {
            const redirectPath = getRedirectPageForRoles(roles);
            console.log("AuthPage: Redirecting to role dashboard:", redirectPath);
            navigate(redirectPath);
          }
        } catch (error) {
          console.error("Error in role redirect:", error);
          navigate('/');
        }
      };
      
      fetchUserRolesAndRedirect();
    }
  }, [user, initialized, navigate, nextParam, toast]);

  // Simple helper to verify if a route exists in the application
  // This is a basic check that just confirms the main path exists
  const verifyRouteExists = (path: string): boolean => {
    // Extract the base path (e.g., /admin, /fetchman, etc.)
    const basePath = path.split('/')[1];
    
    // Check against the known routes defined in App.tsx
    const knownRoutes = ['', 'auth', 'admin', 'fetchman', 'host', 'vendor'];
    
    return knownRoutes.includes(basePath);
  };

  // Function to fetch user roles and redirect based on those roles
  const handleUserRoleRedirect = async (userId: string) => {
    try {
      console.log("AuthPage: Fetching roles for user", userId);
      const { data: userRoles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      
      if (error) {
        console.error("Error fetching user roles:", error);
        toast({
          title: "Could not retrieve user roles",
          description: "Please try again or contact support",
          variant: "destructive"
        });
        return;
      }
      
      const roles = userRoles?.map(r => r.role) || [];
      console.log("AuthPage: User roles retrieved:", roles);
      
      // Redirect to next param if it exists, otherwise use role-based redirect
      if (nextParam) {
        // Verify the nextParam is a valid route to prevent 404s
        const isValidRoute = verifyRouteExists(nextParam);
        
        if (isValidRoute) {
          console.log("AuthPage: Redirecting to requested page:", nextParam);
          navigate(nextParam);
        } else {
          console.log("AuthPage: Requested page may not exist:", nextParam);
          // Use role-based redirect instead of potentially invalid next param
          const redirectPath = getRedirectPageForRoles(roles);
          console.log("AuthPage: Using role-based redirect instead:", redirectPath);
          
          toast({
            title: "Login successful",
            description: "Redirecting you to your dashboard",
          });
          
          navigate(redirectPath);
        }
      } else {
        // Determine redirect based on actual roles
        const redirectPath = getRedirectPageForRoles(roles);
        console.log("AuthPage: Redirecting to", redirectPath);
        
        toast({
          title: "Login successful",
          description: "Welcome back to Venuapp"
        });
        
        navigate(redirectPath);
      }
    } catch (error: any) {
      console.error("Error in role-based redirect:", error);
      // Default to home if role check fails
      navigate("/");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("AuthPage: Successful login for user:", data.user.id);
      
      // Fetch user roles and redirect based on them
      await handleUserRoleRedirect(data.user.id);

    } catch (error: any) {
      console.error("Error logging in:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account",
      });

      // Switch to login tab after successful registration
      setActiveTab("login");
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show loading while we process the redirect
  if (user && initialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-lg">You're already logged in. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col items-center mb-6">
        <img
          src="/lovable-uploads/c8628e28-1db7-453f-b8d6-13301457b8dc.png"
          alt="Venuapp Logo"
          className="h-16 w-16 object-contain"
        />
        <h1 className="text-2xl font-bold mt-2 text-venu-orange">Venuapp</h1>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Welcome to Venuapp</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-xs text-venu-orange hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-venu-orange hover:bg-venu-dark-orange"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-venu-orange hover:bg-venu-dark-orange"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center w-full text-muted-foreground">
            By continuing, you agree to Venuapp's Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>

      {/* Quick test links */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Button variant="outline" size="sm" asChild>
          <Link to="/host">Test Host Panel</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin">Test Admin Panel</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/vendor">Test Vendor Panel</Link>
        </Button>
      </div>
    </div>
  );
}
