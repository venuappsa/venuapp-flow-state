
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, Truck, Clock, MapPin, Smartphone, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserService } from "@/services/UserService";

const fetchmanFormSchema = z.object({
  vehicleType: z.enum(["bicycle", "scooter", "motorcycle", "car", "van"]),
  workHours: z.string().min(1, "Please specify your available work hours"),
  serviceArea: z.string().min(2, "Please specify your service area"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  identityNumber: z.string().min(6, "Please enter a valid identity number"),
  hasOwnTransport: z.boolean(),
  bankAccountNumber: z.string().min(5, "Please enter a valid bank account number"),
  bankName: z.string().min(2, "Please enter your bank name"),
  branchCode: z.string().min(4, "Please enter your branch code"),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export default function FetchmanOnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof fetchmanFormSchema>>({
    resolver: zodResolver(fetchmanFormSchema),
    defaultValues: {
      vehicleType: "scooter",
      workHours: "",
      serviceArea: "",
      phoneNumber: "",
      identityNumber: "",
      hasOwnTransport: false,
      bankAccountNumber: "",
      bankName: "",
      branchCode: "",
      termsAgreed: false,
    }
  });
  
  const onSubmit = async (data: z.infer<typeof fetchmanFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue with fetchman registration",
        variant: "destructive"
      });
      navigate("/auth/login");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await UserService.createFetchmanProfile(user.id, {
        vehicle_type: data.vehicleType,
        work_hours: data.workHours,
        service_area: data.serviceArea,
        phone_number: data.phoneNumber,
        identity_number: data.identityNumber,
        has_own_transport: data.hasOwnTransport,
        bank_account_number: data.bankAccountNumber,
        bank_name: data.bankName,
        branch_code: data.branchCode,
      });
      
      if (success) {
        toast({
          title: "Registration successful",
          description: "Your fetchman profile has been created. You will be notified when approved."
        });
        navigate("/fetchman/dashboard");
      } else {
        toast({
          title: "Registration failed",
          description: "There was an error creating your fetchman profile. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during fetchman registration:", error);
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Truck className="mr-2" /> Fetchman Registration
          </CardTitle>
          <CardDescription>
            Complete this form to register as a Fetchman and start providing delivery services
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bicycle">Bicycle</SelectItem>
                          <SelectItem value="scooter">Scooter</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of vehicle you'll use for deliveries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="workHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Work Hours</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <Input placeholder="e.g. Weekdays 9-5, Weekends 10-4" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        When are you available for deliveries?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="serviceArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Area</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <Input placeholder="e.g. Central Johannesburg, Sandton" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Areas where you're able to make deliveries
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <Input placeholder="+27 21 123 4567" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your contact number for delivery coordination
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="identityNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identity Number / Passport Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      For verification purposes (secured and encrypted)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hasOwnTransport"
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
                        I have my own transport for deliveries
                      </FormLabel>
                      <FormDescription>
                        Confirm that you have access to the vehicle type you selected
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="font-medium mb-4">Banking Details for Payments</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <Input placeholder="e.g. Standard Bank" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="branchCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="termsAgreed"
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
                        I agree to the Terms and Conditions
                      </FormLabel>
                      <FormDescription>
                        By checking this box, you agree to our{" "}
                        <a href="/terms" className="text-venu-orange hover:underline">Terms of Service</a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-venu-orange hover:underline">Privacy Policy</a>
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full bg-venu-orange hover:bg-venu-dark-orange"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col text-sm text-gray-500">
          <p>
            Your application will be reviewed by our team. You'll be notified when approved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
