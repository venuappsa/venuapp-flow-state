
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Mail, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address.")
});

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });
  
  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);
    setResetError("");
    
    try {
      // For demo purposes, simulate password reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would use Supabase to send a password reset email
      // const { error } = await supabase.auth.resetPasswordForEmail(data.email);
      // if (error) throw error;
      
      setResetSent(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions."
      });
    } catch (error: any) {
      console.error("Error sending reset email:", error);
      setResetError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center flex items-center justify-center">
            <KeyRound className="mr-2 h-5 w-5" /> Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {resetError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{resetError}</AlertDescription>
            </Alert>
          )}
          
          {resetSent ? (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <div className="flex flex-col space-y-2">
                  <AlertTitle className="text-green-800">Email Sent</AlertTitle>
                  <AlertDescription className="text-green-700">
                    We've sent password reset instructions to your email. 
                    Please check your inbox and follow the provided link.
                  </AlertDescription>
                </div>
              </Alert>
              
              <div className="text-center mt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/auth/login")}
                  className="flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </div>
            </div>
          ) : (
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
                      <FormDescription className="text-xs">
                        Enter the email address associated with your account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-venu-orange hover:bg-venu-dark-orange" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        
        <CardFooter>
          <div className="w-full text-center">
            <p className="text-sm">
              Remember your password?{" "}
              <Link to="/auth/login" className="text-venu-orange hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
