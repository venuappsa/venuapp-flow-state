
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  Plus, 
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";

// Service categories for dropdown
const SERVICE_CATEGORIES = [
  "Catering",
  "Beverage Service",
  "Decor",
  "Lighting",
  "Audio Equipment",
  "Video Services",
  "Photography",
  "Entertainment",
  "Furniture Rental",
  "Floral Arrangements",
  "Event Planning",
  "Transportation",
  "Venue Services",
  "Staffing",
  "Other"
];

// Schema for a single service
const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  duration: z.string().optional(),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }).min(0, "Price must be a positive number"),
  priceUnit: z.string().default("fixed"),
});

// Schema for the entire form
const servicesFormSchema = z.object({
  services: z.array(serviceSchema).min(1, "Add at least one service"),
});

export default function VendorServicesPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vendorServices, setVendorServices] = useState<any[]>([]);

  // Initialize react-hook-form with useFieldArray for dynamic form fields
  const form = useForm<z.infer<typeof servicesFormSchema>>({
    resolver: zodResolver(servicesFormSchema),
    defaultValues: {
      services: [
        {
          id: "",
          title: "",
          description: "",
          category: "",
          duration: "",
          price: 0,
          priceUnit: "fixed",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  useEffect(() => {
    // Fetch vendor services when component mounts
    const fetchVendorServices = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // In a real app, fetch services from the database
        // Mock data retrieval with a timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if we already have services for this vendor
        const { data, error } = await supabase
          .from("vendor_services")
          .select("*")
          .eq("vendor_id", user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setVendorServices(data);
          
          // Populate form with existing services
          form.reset({
            services: data.map((service: any) => ({
              id: service.id,
              title: service.title,
              description: service.description,
              category: service.category,
              duration: service.duration,
              price: service.price,
              priceUnit: service.price_unit || "fixed",
            })),
          });
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        toast({
          title: "Error loading services",
          description: "Please refresh the page to try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorServices();
  }, [user, form, toast]);

  // Add a new service field
  const handleAddService = () => {
    append({
      id: "",
      title: "",
      description: "",
      category: "",
      duration: "",
      price: 0,
      priceUnit: "fixed",
    });
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof servicesFormSchema>) => {
    if (!user) return;
    setLoading(true);

    try {
      // In a real implementation, you would save to Supabase
      // For this mock version, we'll simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update services table
      for (const service of values.services) {
        if (service.id) {
          // Update existing service
          await supabase
            .from("vendor_services")
            .update({
              title: service.title,
              description: service.description,
              category: service.category,
              duration: service.duration || null,
              price: service.price,
              price_unit: service.priceUnit,
              updated_at: new Date().toISOString(),
            })
            .eq("id", service.id)
            .eq("vendor_id", user.id);
        } else {
          // Insert new service
          await supabase
            .from("vendor_services")
            .insert({
              vendor_id: user.id,
              title: service.title,
              description: service.description,
              category: service.category,
              duration: service.duration || null,
              price: service.price,
              price_unit: service.priceUnit,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
        }
      }

      // Update vendor profile to track onboarding progress
      await supabase
        .from("vendor_profiles")
        .update({
          setup_stage: "pricing",
          setup_progress: 50,
          last_active: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      toast({
        title: "Services saved",
        description: `Successfully saved ${values.services.length} ${
          values.services.length === 1 ? "service" : "services"
        }`,
      });

      // Navigate to the next step after a short delay
      setTimeout(() => {
        navigate("/vendor/pricing");
      }, 1000);
    } catch (error) {
      console.error("Error saving services:", error);
      toast({
        title: "Error saving services",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorPanelLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Add Your Services</h1>
            <p className="text-gray-600 mt-1">
              Step 2 of 4: Define the services you offer
            </p>
          </div>

          <div className="flex items-center">
            <Progress
              value={50}
              className="h-2 w-40 mr-3"
              indicatorClassName="bg-blue-500"
            />
            <span className="text-sm font-medium">50% Complete</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Offerings</CardTitle>
            <CardDescription>
              Add details about each service you provide to event hosts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`p-6 rounded-lg border ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">
                        Service #{index + 1}
                      </h3>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`services.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Wedding Photography" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.category`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SERVICE_CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category}
                                    value={category.toLowerCase()}
                                  >
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`services.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what this service includes and its benefits..."
                              className="resize-none min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Be specific about what's included in this service
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      <FormField
                        control={form.control}
                        name={`services.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. 3 hours, Full day"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              How long this service typically takes
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(
                                    e.target.value === ""
                                      ? 0
                                      : parseFloat(e.target.value)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Starting price for this service
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.priceUnit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select price type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="fixed">Fixed Price</SelectItem>
                                <SelectItem value="hourly">Per Hour</SelectItem>
                                <SelectItem value="daily">Per Day</SelectItem>
                                <SelectItem value="per_person">Per Person</SelectItem>
                                <SelectItem value="starting_at">Starting At</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How your price is calculated
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleAddService}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Service
                </Button>

                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Service Tips</h4>
                    <p className="text-sm text-blue-700">
                      Be clear and specific about what each service includes. Adding multiple 
                      distinct services can increase your bookings and appeal to different 
                      event types.
                    </p>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/vendor/profile")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
            <Button
              className="bg-venu-orange hover:bg-venu-dark-orange"
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  Save and Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </VendorPanelLayout>
  );
}
