import React, { useState } from "react";
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

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Get the redirect path from location state, or default to "/"
  const from = location.state?.from || "/";

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
      
      // Determine redirect based on actual roles
      const redirectPath = getRedirectPageForRoles(roles);
      console.log("AuthPage: Redirecting to", redirectPath);
      
      toast({
        title: "Login successful",
        description: "Welcome back to Venuapp"
      });
      
      navigate(redirectPath);
    } catch (error: any) {
      console.error("Error in role-based redirect:", error);
      // Default to host dashboard if role check fails
      navigate("/host");
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
      <div className="mt-8 flex gap-4">
        <Button variant="outline" size="sm" asChild>
          <a href="/host">Test Host Panel</a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="/admin">Test Admin Panel</a>
        </Button>
      </div>
    </div>
  );
}
