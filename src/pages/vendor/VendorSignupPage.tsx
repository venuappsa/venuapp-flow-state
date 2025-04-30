
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProfileAndRole } from "@/hooks/useAuthHelpers";
import { ArrowRight, ChevronLeft, Store } from "lucide-react";

// Business categories for the vendor signup form
const BUSINESS_CATEGORIES = [
  { id: "food", name: "Food & Beverages" },
  { id: "decoration", name: "Decoration & Design" },
  { id: "entertainment", name: "Entertainment" },
  { id: "equipment", name: "Equipment Rental" },
  { id: "photo", name: "Photography & Video" },
  { id: "venue", name: "Venue Services" },
  { id: "planning", name: "Event Planning" },
  { id: "staffing", name: "Staffing Solutions" },
  { id: "other", name: "Other Services" },
];

// Form schema for validation
const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  name: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  category: z.string().min(1, "Business category is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function VendorSignupPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      category: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // Sign up the vendor with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            business_name: values.businessName,
            business_category: values.category,
          },
        },
      });
      
      if (error) throw error;

      if (data.user) {
        // Create profile and set role to 'merchant'
        await createProfileAndRole({
          userId: data.user.id,
          name: values.name,
          surname: values.surname,
          email: values.email,
          phone: values.phone,
          role: 'merchant',
        });

        // Create mock vendor profile with initial onboarding state
        const { error: vendorError } = await supabase
          .from("vendor_profiles")
          .update({
            business_name: values.businessName,
            business_category: values.category,
            setup_stage: 'welcome',
            setup_progress: 0,
            status: 'draft',
            last_active: new Date().toISOString(),
          })
          .eq('user_id', data.user.id);
        
        if (vendorError) {
          console.error("Error updating vendor profile:", vendorError);
        }

        toast({
          title: "Registration successful!",
          description: "Welcome to Venuapp. Let's get started with your onboarding.",
        });

        // Redirect to welcome page
        navigate("/vendor/welcome");
      }
    } catch (error: any) {
      console.error("Error during signup:", error);
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem creating your account.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </a>
          <div className="flex justify-center mt-4">
            <div className="bg-venu-orange p-3 rounded-full">
              <Store className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Become a vendor</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our platform and showcase your services to event hosts
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create your vendor account</CardTitle>
            <CardDescription>
              Fill out the form below to get started. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Business Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Last Name" {...field} />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="you@example.com" 
                          autoComplete="email" 
                          {...field} 
                        />
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="Your Phone Number"
                          autoComplete="tel"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BUSINESS_CATEGORIES.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input 
                          type="password" 
                          placeholder="Create a password" 
                          autoComplete="new-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        At least 8 characters
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
                        <Input 
                          type="password" 
                          placeholder="Confirm your password" 
                          autoComplete="new-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the <a href="#" className="text-venu-orange hover:underline">Terms of Service</a> and <a href="#" className="text-venu-orange hover:underline">Privacy Policy</a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-venu-orange hover:bg-venu-dark-orange" 
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Vendor Account"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/auth/login" className="text-venu-orange hover:underline">
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
