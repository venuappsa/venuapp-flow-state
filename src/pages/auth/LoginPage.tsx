
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { LogIn, Mail, KeyRound, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.")
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  // If user is already logged in, redirect to appropriate dashboard
  React.useEffect(() => {
    if (user) {
      // For demo purposes, redirect based on email
      if (user.email?.includes("admin")) {
        navigate("/admin");
      } else {
        navigate("/host");
      }
    }
  }, [user, navigate]);
  
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    setLoginError("");
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (error) {
        setLoginError(error.message);
        return;
      }
      
      // Successfully logged in, simulate redirect to 2FA page for demo
      if (authData.user) {
        // For the demo, if email contains specific roles, simulate 2FA and then redirect
        if (data.email.includes("2fa")) {
          navigate("/auth/2fa", { state: { email: data.email } });
        } else {
          toast({
            title: "Login successful",
            description: "Welcome back to Venuapp"
          });
          
          // Redirect based on role
          if (data.email.includes("admin")) {
            navigate("/admin");
          } else {
            navigate("/host");
          }
        }
      }
    } catch (error: any) {
      console.error("Error logging in:", error);
      setLoginError(error.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // For demo purposes - quick login with predefined credentials
  const handleQuickLogin = (role: "admin" | "host") => {
    form.setValue("email", role === "admin" ? "admin@example.com" : "host@example.com");
    form.setValue("password", "password123");
    form.handleSubmit(onSubmit)();
  };
  
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
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 space-y-2">
            <p className="text-xs text-center text-gray-500">Quick demo login:</p>
            <div className="flex gap-2">
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
