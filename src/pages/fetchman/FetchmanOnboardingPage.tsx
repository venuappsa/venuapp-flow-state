import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/use-toast";
import { UserService } from "@/services/UserService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader, MapPin, Truck, Clock, AlertCircle, CreditCard } from "lucide-react";

const fetchmanSchema = z.object({
  vehicle_type: z.string().min(1, "Vehicle type is required"),
  work_hours: z.string().min(1, "Work hours are required"),
  service_area: z.string().min(1, "Service area is required"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  identity_number: z.string().min(6, "ID number is required"),
  has_own_transport: z.boolean(),
  bank_account_number: z.string().min(6, "Bank account number is required"),
  bank_name: z.string().min(2, "Bank name is required"),
  branch_code: z.string().min(1, "Branch code is required"),
});

// Define the fetchman profile data type
type FetchmanProfileData = z.infer<typeof fetchmanSchema>;

export default function FetchmanOnboardingPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const form = useForm<FetchmanProfileData>({
    resolver: zodResolver(fetchmanSchema),
    defaultValues: {
      vehicle_type: "",
      work_hours: "Full-time (9AM-5PM, Mon-Fri)",
      service_area: "",
      phone_number: "",
      identity_number: "",
      has_own_transport: false,
      bank_account_number: "",
      bank_name: "",
      branch_code: "",
    },
  });
  
  // Check if user is already logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue with the Fetchman onboarding process.",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);
  
  const onSubmit = async (values: FetchmanProfileData) => {
    if (!user) {
      setErrorMessage("You must be logged in to complete your profile");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      console.log("Submitting fetchman profile with data:", values);
      
      // Ensure all required fields are present and not undefined
      const profileData = {
        vehicle_type: values.vehicle_type,
        work_hours: values.work_hours,
        service_area: values.service_area,
        phone_number: values.phone_number,
        identity_number: values.identity_number,
        has_own_transport: values.has_own_transport,
        bank_account_number: values.bank_account_number,
        bank_name: values.bank_name,
        branch_code: values.branch_code
      };
      
      // Call the updated service method with proper error handling
      const result = await UserService.createFetchmanProfile(user.id, profileData);
      
      if (result.success) {
        toast({
          title: "Profile created successfully",
          description: "Your fetchman profile has been set up. You can now start accepting deliveries.",
        });
        
        // Redirect to dashboard
        navigate("/fetchman/dashboard");
      } else {
        setErrorMessage(result.error || "There was an error creating your profile. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during fetchman onboarding:", error);
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container max-w-3xl py-8 mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center">
          <Truck className="mr-2 h-6 w-6" />
          Complete Your Fetchman Profile
        </h1>
        <p className="text-gray-500 mt-2">
          Enter your details below to start your journey as a Fetchman delivery driver
        </p>
      </div>
      
      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Personal & Vehicle Information</CardTitle>
          <CardDescription>
            Tell us about yourself and your transportation
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+27 71 234 5678" {...field} />
                      </FormControl>
                      <FormDescription>
                        We'll use this to contact you about deliveries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="identity_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your ID number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Required for verification and payment processing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-6" />
                <h3 className="text-lg font-medium flex items-center">
                  <Truck className="mr-2 h-5 w-5" /> 
                  Transport Information
                </h3>
                
                <FormField
                  control={form.control}
                  name="vehicle_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your vehicle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="bicycle">Bicycle</SelectItem>
                          <SelectItem value="van">Van/Delivery Vehicle</SelectItem>
                          <SelectItem value="truck">Small Truck</SelectItem>
                          <SelectItem value="none">No Vehicle</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the primary vehicle you'll use for deliveries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_own_transport"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Own Transport</FormLabel>
                        <FormDescription>
                          Do you have your own reliable transport?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Separator className="my-6" />
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="mr-2 h-5 w-5" /> 
                  Availability & Service Area
                </h3>
                
                <FormField
                  control={form.control}
                  name="work_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Work Hours</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your preferred work hours" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time (9AM-5PM, Mon-Fri)">Full-time (9AM-5PM, Mon-Fri)</SelectItem>
                          <SelectItem value="Evenings & Weekends">Evenings & Weekends</SelectItem>
                          <SelectItem value="Weekends Only">Weekends Only</SelectItem>
                          <SelectItem value="Flexible Hours">Flexible Hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        When are you typically available for deliveries?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="service_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Area</FormLabel>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input placeholder="e.g. Johannesburg Central, Sandton, Rosebank" {...field} />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Enter neighborhoods or areas you can service
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-6" />
                <h3 className="text-lg font-medium flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" /> 
                  Banking Details
                </h3>
                
                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Standard Bank, FNB, Absa" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your bank name for payment deposits
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="bank_account_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="branch_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Your branch code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-venu-orange hover:bg-venu-dark-orange"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete Registration & Continue"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 border-t bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-500">
            <h4 className="font-medium">What happens next?</h4>
            <p className="mt-1">
              After submission, our team will review your details. Once approved, you'll be able to accept delivery assignments in your service area.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
