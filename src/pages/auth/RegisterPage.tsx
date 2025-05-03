
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserService } from "@/services/UserService";
import { User, Mail, KeyRound, Phone, Shield, AlertCircle, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const registerFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 characters."),
  role: z.enum(["host", "merchant", "fetchman", "customer"]),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "host",
      password: "",
      confirmPassword: ""
    }
  });
  
  const onSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    setRegisterError("");
    
    try {
      const { email, password, firstName, lastName, role, phone } = data;
      
      const result = await UserService.registerUser(email, password, {
        firstName,
        lastName,
        phone,
        role
      });
      
      if (!result.success) {
        setRegisterError(result.error || "Registration failed");
        return;
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in to continue."
      });
      
      // Redirect to login
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Error registering:", error);
      setRegisterError(error.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-lg">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center flex items-center justify-center">
            <User className="mr-2 h-5 w-5" /> Create Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Fill out the form below to register a new account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {registerError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{registerError}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <Input placeholder="John" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <Input placeholder="Doe" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input placeholder="name@example.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input placeholder="+27 21 123 4567" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="host">Host/Event Organizer</SelectItem>
                            <SelectItem value="merchant">Merchant/Vendor</SelectItem>
                            <SelectItem value="fetchman">Fetchman</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Choose the type of account you want to create
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input type="password" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Password must be at least 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <Input type="password" className="pl-10" {...field} />
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
                    Creating account...
                  </>
                ) : "Create Account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter>
          <div className="w-full text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-venu-orange hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
