import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserService } from "@/services/UserService";
import { useUser } from "@/hooks/useUser";
import { LogIn, Mail, KeyRound, AlertCircle, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getRedirectPageForRoles } from "@/hooks/useRoleRedirect";
import { supabase } from "@/integrations/supabase/client";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, initialized } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  
  // Get next path from URL parameters or location state
  const nextPath = searchParams.get('next') || location.state?.from?.pathname || null;
  const requiredRole = searchParams.get('required') || null;
  
  // Check initial auth state
  useEffect(() => {
    if (!initialized) return;
    
    const checkAuth = async () => {
      console.log("LoginPage: Checking auth state");
      try {
        const { data } = await supabase.auth.getSession();
        console.log("LoginPage: Session check:", !!data.session);
        
        if (data.session?.user) {
          console.log("LoginPage: User already logged in, fetching roles for redirection");
          await handleUserRoleRedirect(data.session.user.id);
        }
      } catch (error) {
        console.error("LoginPage: Error checking auth:", error);
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [initialized]);
  
  // If user state changes (like after login), handle redirect
  useEffect(() => {
    if (user && authChecked) {
      console.log("LoginPage: User state changed, handling redirect");
      handleUserRoleRedirect(user.id);
    }
  }, [user, authChecked]);
  
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  // Function to fetch user roles and redirect based on those roles
  const handleUserRoleRedirect = async (userId: string) => {
    try {
      console.log("LoginPage: Fetching roles for user", userId);
      
      // Use our service to get roles
      const roles = await UserService.getUserRoles(userId);
      console.log("LoginPage: User roles retrieved:", roles);
      
      // Check if user has the required role (if specified)
      if (requiredRole && !roles.includes(requiredRole)) {
        toast({
          title: "Access denied",
          description: `You don't have the required role: ${requiredRole}`,
          variant: "destructive"
        });
        return;
      }
      
      // Determine redirect based on roles and nextPath
      let redirectPath = nextPath;
      
      // If no specific next path, determine based on roles
      if (!redirectPath) {
        redirectPath = getRedirectPageForRoles(roles);
      }
      
      console.log("LoginPage: Redirecting to", redirectPath);
      
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
  
  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    setLoginError("");
    
    try {
      const result = await UserService.loginUser(data.email, data.password);
      
      if (!result.success) {
        setLoginError(result.error || "Login failed");
        setIsLoading(false);
        return;
      }
      
      // Successfully logged in
      if (result.data) {
        console.log("LoginPage: Successful login for user:", result.data.id);
        
        // For the demo, if email contains 2fa, simulate 2FA
        if (data.email.includes("2fa")) {
          navigate("/auth/2fa", { state: { email: data.email } });
        } else {
          // Otherwise, fetch user roles and redirect
          // The redirect will be handled by the useEffect hook watching user state
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      console.error("Error logging in:", error);
      setLoginError(error.message || "An error occurred during login.");
      setIsLoading(false);
    }
  };
  
  // For demo purposes - quick login with predefined credentials
  const handleQuickLogin = async (role: "admin" | "host" | "vendor") => {
    let email, password;
    
    switch(role) {
      case "admin":
        email = "admin@example.com";
        password = "password123";
        break;
      case "host":
        email = "host@example.com";
        password = "password123";
        break;
      case "vendor":
        email = "merchant@example.com";
        password = "password123";
        break;
      default:
        email = "host@example.com";
        password = "password123";
    }
    
    form.setValue("email", email);
    form.setValue("password", password);
    await form.handleSubmit(onSubmit)();
  };
  
  if (isLoading) {
    return (
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-8">
              <Loader className="h-8 w-8 animate-spin text-venu-orange mb-4" />
              <p>Processing login...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center flex items-center justify-center">
            <LogIn className="mr-2 h-5 w-5" /> Login to Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          {requiredRole && (
            <Alert className="mb-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Role Required</AlertTitle>
              <AlertDescription className="text-amber-700">
                This page requires the {requiredRole} role to access.
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                          placeholder="name@example.com" 
                          className="pl-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link to="/auth/forgot-password" className="text-xs text-venu-orange hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input 
                          type="password" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-venu-orange hover:bg-venu-dark-orange" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : "Login"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 space-y-2">
            <p className="text-xs text-center text-gray-500">Quick demo login:</p>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleQuickLogin("admin")} 
                disabled={isLoading}
              >
                Admin
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => handleQuickLogin("host")}
                disabled={isLoading}
              >
                Host
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                onClick={() => handleQuickLogin("vendor")}
                disabled={isLoading}
              >
                Vendor
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="w-full text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-venu-orange hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
