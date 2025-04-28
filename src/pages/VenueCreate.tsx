
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Building, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VenueFormValues {
  name: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  description: string;
  capacity: number;
}

export default function VenueCreate() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<VenueFormValues>({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      province: "",
      postal_code: "",
      description: "",
      capacity: 100,
    },
  });
  
  const onSubmit = async (data: VenueFormValues) => {
    setIsSubmitting(true);
    try {
      // Since we haven't created a venues table yet, this is just a mock
      // In a real implementation, we would insert into the venues table
      
      // For now, show a success message with venue details
      toast({
        title: "Venue Created!",
        description: `${data.name} has been created successfully. You can now set up vendor rules for this venue.`,
      });
      
      navigate("/host/rules");
    } catch (error) {
      console.error("Error creating venue:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create venue. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AuthTransitionWrapper requireAuth allowedRoles={["host"]}>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/host")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Host Panel
          </Button>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-lg shadow">
              <Building className="h-8 w-8 text-venu-orange" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create New Venue</h1>
              <p className="text-gray-600">Set up details for your new venue</p>
            </div>
          </div>
          
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-labelledby="venue-form-title">
                <h2 id="venue-form-title" className="sr-only">Create venue form</h2>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. The Horizon Conference Center" 
                          {...field} 
                          autoComplete="organization"
                        />
                      </FormControl>
                      <FormDescription>
                        The official name of your venue that will be visible to vendors and customers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your venue and what makes it special..." 
                          className="min-h-[120px]" 
                          {...field} 
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123 Event Street" 
                            {...field} 
                            autoComplete="street-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Johannesburg" 
                            {...field} 
                            autoComplete="address-level2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Gauteng" 
                            {...field} 
                            autoComplete="address-level1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="2000" 
                            {...field} 
                            autoComplete="postal-code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Capacity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="100" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription>
                        The maximum number of people your venue can accommodate.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" className="bg-venu-orange hover:bg-venu-orange/90" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Venue & Continue to Rules"}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
}
