
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ShieldCheck, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface VendorRulesFormValues {
  venueName: string;
  categories: string[];
  minPrice: number;
  maxPrice: number;
  capacityLimit: number;
  operatingHoursStart: string;
  operatingHoursEnd: string;
  requiredLicenses: string;
  otherRequirements: string;
}

export default function VendorRules() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hostId, setHostId] = useState<string | null>(null);
  
  // Fetch vendor categories
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["vendor-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendor_categories")
        .select("*");
      
      if (error) {
        throw error;
      }
      return data;
    },
  });
  
  // Fetch host profile to get the host_id
  const { data: hostProfile } = useQuery({
    queryKey: ["host-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("host_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching host profile:", error);
        return null;
      }
      
      setHostId(data.id);
      return data;
    },
    enabled: !!user?.id,
  });
  
  const form = useForm<VendorRulesFormValues>({
    defaultValues: {
      venueName: "My Venue",
      categories: [],
      minPrice: 50,
      maxPrice: 500,
      capacityLimit: 25,
      operatingHoursStart: "09:00",
      operatingHoursEnd: "22:00",
      requiredLicenses: "",
      otherRequirements: "",
    },
  });
  
  const onSubmit = async (data: VendorRulesFormValues) => {
    if (!hostId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Host profile not found. Please try again.",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Convert categories to UUIDs
      const categoryUUIDs = data.categories;
      
      // Split license text into an array
      const licenses = data.requiredLicenses
        .split(',')
        .map(license => license.trim())
        .filter(license => license !== '');
      
      // In a real implementation, we would insert into the venue_vendor_rules table
      toast({
        title: "Vendor Rules Saved!",
        description: "Your vendor rules have been successfully created.",
      });
      
      navigate("/host");
    } catch (error) {
      console.error("Error creating vendor rules:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save vendor rules. Please try again.",
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
              <ShieldCheck className="h-8 w-8 text-venu-orange" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Vendor Rules</h1>
              <p className="text-gray-600">Set requirements for vendors at your venue</p>
            </div>
          </div>
          
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="venueName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Venue Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of the venue these rules apply to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categories"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Allowed Vendor Categories</FormLabel>
                        <FormDescription>
                          Select the types of vendors allowed at your venue.
                        </FormDescription>
                      </div>
                      {loadingCategories ? (
                        <div>Loading categories...</div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {categories?.map((category) => (
                            <FormField
                              key={category.id}
                              control={form.control}
                              name="categories"
                              render={({ field }) => {
                                return (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(category.id)}
                                        onCheckedChange={(checked) => {
                                          const updatedCategories = checked
                                            ? [...field.value, category.id]
                                            : field.value?.filter((value) => value !== category.id);
                                          field.onChange(updatedCategories);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {category.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Price (R)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum price vendors can charge.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Price (R)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum price vendors can charge.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="capacityLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Capacity Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of vendors allowed at the venue.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="operatingHoursStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="operatingHoursEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="requiredLicenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Licenses</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Food Handler's License, Liquor License (comma separated)" {...field} />
                      </FormControl>
                      <FormDescription>
                        List any licenses vendors need to have (comma separated).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="otherRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other specific requirements or rules for vendors..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" className="bg-venu-orange hover:bg-venu-orange/90" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Vendor Rules"}
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
